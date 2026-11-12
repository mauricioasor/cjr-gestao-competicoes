// Estado da demo + regras de negócio. Em produção, cada ação vira um endpoint da API REST
// e cada registro de auditoria/evento sai da mesma transação (padrão outbox).
import { ACESSOS_ESCOLAS, ACESSOS_JUIZES, AUDITORIA, AVALIACOES, CATEGORIAS, EDICAO, EQUIPES, ESCOLAS, EVENTOS, USERS, totalPonderado } from '../data/seed.js'

export const initialState = () => ({
  role: null, // sessão: null = tela de entrada
  acessos: { escolas: structuredClone(ACESSOS_ESCOLAS), juizes: structuredClone(ACESSOS_JUIZES) },
  edicao: EDICAO,
  escolas: ESCOLAS,
  categorias: structuredClone(CATEGORIAS),
  regrasHistorico: CATEGORIAS.map((c) => ({ categoriaId: c.id, versao: 1, subcategorias: c.subcategorias, autor: USERS.coord.nome, em: AUDITORIA[2].em, motivo: 'Configuração inicial da edição' })),
  equipes: structuredClone(EQUIPES),
  chaves: {},
  avaliacoes: structuredClone(AVALIACOES),
  auditoria: structuredClone(AUDITORIA),
  eventos: structuredClone(EVENTOS),
  ultimoPlacar: null,
  // Agenda do dia (fictícia): a categoria atual e as próximas, para o contador do placar.
  agenda: (() => {
    const t0 = Date.now()
    const ordem = ['robotica-lego', 'seguidor-linha', 'estoura-balao', 'atto-microbit', 'artbot-junior', 'artbot-expert', 'tec-educacional']
    return ordem.map((categoriaId, i) => ({ categoriaId, inicio: i === 0 ? t0 - 25 * 60e3 : t0 + (5 + (i - 1) * 20) * 60e3 }))
  })(),
})

const agora = () => new Date().toISOString()
let seq = 100
const nid = (p) => `${p}-${++seq}`

const audit = (s, ator, acao, entidade, ref, detalhe, antes, depois) => ({
  ...s,
  auditoria: [{ id: nid('aud'), em: agora(), ator, acao, entidade, ref, detalhe, antes, depois }, ...s.auditoria],
})

const emitir = (s, tipo, payload) => ({
  ...s,
  eventos: [{ id: nid('evt'), tipo, direcao: 'saida', origem: 'Desafio 02', destino: 'Desafio 03 · Histórico Público', em: agora(), status: 'entregue', payload }, ...s.eventos],
})

const ator = (s) => USERS[s.role]?.nome || 'Sistema'

// --- regras de elegibilidade (RN05) --------------------------------------
const anoNum = (ano) => (ano === 'EJA' || ano === 'Professor' ? null : parseInt(ano, 10))

export function elegibilidade(cat, integrantes) {
  const erros = []
  const porMembro = integrantes.map((m) => {
    if (!m.ano) return 'Informe o ano escolar'
    if (cat.publico.tipo === 'ano') {
      const a = anoNum(m.ano)
      if (a == null || a < cat.publico.min || a > cat.publico.max)
        return `${cat.nome} aceita alunos do ${cat.publico.min}º ao ${cat.publico.max}º ano`
    }
    if (cat.publico.tipo === 'eja' && m.ano !== 'EJA') return `${cat.nome} é exclusiva da EJA`
    return null
  })
  const qtd = integrantes.length
  if (qtd < cat.equipe.min) erros.push(`Faltam ${cat.equipe.min - qtd} integrante(s): mínimo de ${cat.equipe.min}`)
  if (qtd > cat.equipe.max) erros.push(`Excede o máximo de ${cat.equipe.max} integrantes`)
  if (cat.exigeProfessor && !integrantes.some((m) => m.ano === 'Professor')) erros.push('A equipe precisa de ao menos um professor')
  if (porMembro.some(Boolean)) erros.push('Há integrante fora da faixa permitida')
  return { ok: erros.length === 0, erros, porMembro }
}

// --- chaveamento (duelos) --------------------------------------------------
const mulberry32 = (a) => () => {
  a |= 0; a = (a + 0x6d2b79f5) | 0
  let t = Math.imul(a ^ (a >>> 15), 1 | a)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}
export function sortear(ids, semente) {
  const r = mulberry32(semente), arr = [...ids]
  for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]] }
  return arr
}

export const FASES = ['Quartas de final', 'Semifinal', 'Final']

// Chave derivada: só vencedores HOMOLOGADOS avançam (RN02). Uma correção propaga sozinha.
export function montarChave(state, categoriaId) {
  const ch = state.chaves[categoriaId]
  if (!ch) return null
  const res = (pid) => state.avaliacoes.find((a) => a.partidaId === pid && a.status !== 'devolvido')
  const fases = []
  let entrantes = ch.ordem
  FASES.forEach((nomeFase, f) => {
    const partidas = []
    for (let i = 0; i < entrantes.length; i += 2) {
      const id = `${categoriaId}-f${f}-p${i / 2}`
      const a = entrantes[i], b = entrantes[i + 1]
      const av = res(id)
      const homologado = av?.status === 'homologado'
      partidas.push({
        id, fase: f, nomeFase, idx: i / 2, a, b, avaliacao: av || null,
        status: !a || !b ? 'aguardando' : !av ? 'a-jogar' : av.status,
        vencedor: homologado ? (av.vencedor === 'a' ? a : b) : null,
      })
    }
    fases.push(partidas)
    entrantes = partidas.map((p) => p.vencedor)
  })
  return { ...ch, fases }
}

// --- ranking (projeção — nunca editado à mão) -----------------------------
export function ranking(state, categoriaId) {
  const cat = state.categorias.find((c) => c.id === categoriaId)
  const homologadas = state.avaliacoes.filter((a) => a.categoriaId === categoriaId && a.status === 'homologado' && !a.partidaId)
  const desempate = cat.subcategorias[0]?.id
  return homologadas
    .map((a) => ({ ...a, equipe: state.equipes.find((e) => e.id === a.equipeId) }))
    .sort((x, y) => y.total - x.total || (y.notas?.[desempate] || 0) - (x.notas?.[desempate] || 0))
    .map((a, i) => ({ ...a, posicao: i + 1 }))
}

const payloadResultado = (state, av) => {
  const eqp = state.equipes.find((e) => e.id === av.equipeId)
  return {
    evento: av.versao > 1 ? 'resultado.corrigido' : 'resultado.homologado',
    versao_contrato: '1.0',
    edicao_id: state.edicao.id,
    categoria_id: av.categoriaId,
    resultado_id: av.id,
    ...(av.partidaId
      ? { partida_id: av.partidaId, rounds: av.rounds, vencedor_equipe_id: av.vencedor === 'a' ? av.equipeA : av.equipeB }
      : { equipe_id: eqp?.id, escola_id: eqp?.escolaId, total: av.total }),
    versao: av.versao,
    regra_versao: av.regraVersao,
    homologado_por: USERS.coord.id,
    homologado_em: av.homologadoEm,
    ...(av.versao > 1 ? { motivo_correcao: av.historico.at(-1)?.motivo } : {}),
  }
}

// --- reducer ---------------------------------------------------------------
export function reducer(state, action) {
  switch (action.type) {
    case 'RESET': return { ...initialState(), role: state.role }
    case 'LOGIN': {
      const u = USERS[action.role]
      const s = { ...state, role: action.role }
      return action.role === 'publico' ? s : audit(s, u.nome, 'Entrou pelo link de acesso', 'Acesso', u.papel, u.escopo)
    }
    case 'LOGOUT': return { ...state, role: null }

    case 'INVITE_SCHOOL': {
      const { escolaId, responsavel, email } = action
      const esc = state.escolas.find((e) => e.id === escolaId)
      const s = { ...state, acessos: { ...state.acessos, escolas: state.acessos.escolas.map((a) => (a.escolaId === escolaId ? { ...a, responsavel, email, status: 'enviado' } : a)) } }
      return audit(s, ator(state), 'Enviou convite de acesso', 'Acesso', esc.nome, `${responsavel} · válido só para a escola na edição ${state.edicao.ano}`)
    }
    case 'INVITE_JUDGE': {
      const { nome, email, categorias } = action
      const s = { ...state, acessos: { ...state.acessos, juizes: [...state.acessos.juizes, { id: nid('usr-juiz'), nome, email, categorias, status: 'enviado' }] } }
      const nomes = categorias.map((c) => state.categorias.find((x) => x.id === c)?.nome).join(', ')
      return audit(s, ator(state), 'Convidou juiz', 'Acesso', nome, `Escopo: ${nomes} · expira ao fim do evento`)
    }
    case 'REVOKE': {
      const { tipo, id } = action
      let alvo
      const acessos = tipo === 'escola'
        ? { ...state.acessos, escolas: state.acessos.escolas.map((a) => { if (a.escolaId !== id) return a; alvo = state.escolas.find((e) => e.id === id)?.nome; return { ...a, status: 'revogado' } }) }
        : { ...state.acessos, juizes: state.acessos.juizes.map((j) => { if (j.id !== id) return j; alvo = j.nome; return { ...j, status: 'revogado' } }) }
      return audit({ ...state, acessos }, ator(state), 'Revogou acesso', 'Acesso', alvo, 'O histórico de ações dessa pessoa continua na auditoria')
    }

    case 'PUBLISH_RULES': {
      const { categoriaId, subcategorias, motivo } = action
      const cat = state.categorias.find((c) => c.id === categoriaId)
      const versao = cat.regraVersao + 1
      const antes = cat.subcategorias.map((s) => `${s.nome} ${s.peso}%`).join(' · ')
      const depois = subcategorias.map((s) => `${s.nome} ${s.peso}%`).join(' · ')
      let s = {
        ...state,
        categorias: state.categorias.map((c) => (c.id === categoriaId ? { ...c, subcategorias, regraVersao: versao } : c)),
        regrasHistorico: [{ categoriaId, versao, subcategorias, autor: ator(state), em: agora(), motivo }, ...state.regrasHistorico],
      }
      s = audit(s, ator(state), `Publicou regras v${versao}`, 'Regras', cat.nome, motivo, antes, depois)
      return s
    }

    case 'ADD_TEAM': {
      const t = { ...action.equipe, id: nid('eq'), status: 'inscrita' }
      const cat = state.categorias.find((c) => c.id === t.categoriaId)
      let s = { ...state, equipes: [...state.equipes, t] }
      return audit(s, ator(state), 'Inscreveu equipe', 'Inscrição', t.nome, `${cat.nome} · ${t.integrantes.length} integrantes · elegibilidade validada`)
    }

    case 'DRAW': {
      const { categoriaId, semente } = action
      const cat = state.categorias.find((c) => c.id === categoriaId)
      const todas = state.equipes.filter((e) => e.categoriaId === categoriaId).map((e) => e.id)
      const ordem = sortear(cat.formato === 'duelos' ? todas.slice(0, 8) : todas, semente)
      let s = { ...state, chaves: { ...state.chaves, [categoriaId]: { semente, ordem, sorteadoPor: ator(state), em: agora() } } }
      return audit(s, ator(state), cat.formato === 'duelos' ? 'Sorteou chaveamento' : 'Sorteou ordem de apresentação', 'Chaveamento', cat.nome, `Semente ${semente} · ${ordem.length} equipes · reproduzível`)
    }

    case 'SUBMIT_EVAL': {
      const cat = state.categorias.find((c) => c.id === action.avaliacao.categoriaId)
      const a = {
        ...action.avaliacao, id: nid('av'), juiz: ator(state), status: 'pendente', versao: 1,
        regraVersao: cat.regraVersao, criadoEm: agora(), historico: [],
      }
      let s = { ...state, avaliacoes: [...state.avaliacoes.filter((x) => !(x.status === 'devolvido' && x.equipeId === a.equipeId && x.partidaId === a.partidaId)), a] }
      const alvo = a.partidaId ? `Duelo ${a.rotulo}` : state.equipes.find((e) => e.id === a.equipeId)?.nome
      return audit(s, ator(state), 'Lançou avaliação', 'Avaliação', alvo, `${cat.nome} · ${a.partidaId ? `placar ${a.totalA} × ${a.totalB}` : `total ${a.total}`} · aguardando homologação`)
    }

    case 'HOMOLOGATE': {
      const a0 = state.avaliacoes.find((x) => x.id === action.id)
      if (a0.juiz === ator(state)) return state // RN01: quem lança não homologa
      const a = { ...a0, status: 'homologado', homologadoPor: ator(state), homologadoEm: agora() }
      let s = { ...state, avaliacoes: state.avaliacoes.map((x) => (x.id === a.id ? a : x)), ultimoPlacar: { id: a.id, em: Date.now() } }
      const alvo = a.partidaId ? `Duelo ${a.rotulo}` : state.equipes.find((e) => e.id === a.equipeId)?.nome
      s = audit(s, ator(state), 'Homologou resultado', 'Resultado', alvo, `Lançado por ${a.juiz} · publicado no placar e no Histórico`)
      return emitir(s, 'resultado.homologado', payloadResultado(s, a))
    }

    case 'RETURN': {
      const a = state.avaliacoes.find((x) => x.id === action.id)
      let s = { ...state, avaliacoes: state.avaliacoes.map((x) => (x.id === a.id ? { ...x, status: 'devolvido', motivoDevolucao: action.motivo } : x)) }
      const alvo = a.partidaId ? `Duelo ${a.rotulo}` : state.equipes.find((e) => e.id === a.equipeId)?.nome
      return audit(s, ator(state), 'Devolveu ao juiz', 'Avaliação', alvo, action.motivo)
    }

    case 'CORRECT': {
      const a0 = state.avaliacoes.find((x) => x.id === action.id)
      const cat = state.categorias.find((c) => c.id === a0.categoriaId)
      const snap = { versao: a0.versao, notas: a0.notas, rounds: a0.rounds, total: a0.total, totalA: a0.totalA, totalB: a0.totalB, vencedor: a0.vencedor, homologadoPor: a0.homologadoPor, homologadoEm: a0.homologadoEm }
      let novo = { ...a0, versao: a0.versao + 1, homologadoPor: ator(state), homologadoEm: agora(), historico: [...a0.historico, { ...snap, motivo: action.motivo, por: ator(state), em: agora() }] }
      let antes, depois
      if (a0.partidaId) {
        const totalA = action.rounds.reduce((s, r) => s + Number(r.a || 0), 0)
        const totalB = action.rounds.reduce((s, r) => s + Number(r.b || 0), 0)
        novo = { ...novo, rounds: action.rounds, totalA, totalB, vencedor: totalA === totalB ? action.vencedor : totalA > totalB ? 'a' : 'b' }
        antes = `${a0.totalA} × ${a0.totalB}`; depois = `${totalA} × ${totalB}`
      } else {
        novo = { ...novo, notas: action.notas, total: totalPonderado(cat, action.notas) }
        antes = `total ${a0.total}`; depois = `total ${novo.total}`
      }
      let s = { ...state, avaliacoes: state.avaliacoes.map((x) => (x.id === a0.id ? novo : x)), ultimoPlacar: { id: a0.id, em: Date.now() } }
      const alvo = a0.partidaId ? `Duelo ${a0.rotulo}` : state.equipes.find((e) => e.id === a0.equipeId)?.nome
      s = audit(s, ator(state), `Corrigiu resultado (v${novo.versao})`, 'Resultado', alvo, action.motivo, antes, depois)
      return emitir(s, 'resultado.corrigido', payloadResultado(s, novo))
    }
    default: return state
  }
}
