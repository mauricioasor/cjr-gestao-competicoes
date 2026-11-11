// Dados FICTÍCIOS para demonstração (regulamento do hackathon, seção 9).
// Categorias e regras de público/tamanho de equipe seguem o material oficial do CJR;
// pesos de subcategorias e tamanhos marcados `confirmado:false` são suposições a validar com o edital.

export const EDICAO = {
  id: 'cjr-2027',
  numero: 7,
  ano: 2027,
  nome: '7º Campeonato Joinvilense de Robótica',
  tema: 'Tema 2027 (definido pela Gestão do Evento)',
  fonte: 'Desafio 01 · Gestão do Evento',
}

export const ESCOLAS = [
  { id: 'esc-01', nome: 'EM Prof.ª Helena Brandt' },
  { id: 'esc-02', nome: 'EM Jardim das Araucárias' },
  { id: 'esc-03', nome: 'EM Vale das Hortênsias' },
  { id: 'esc-04', nome: 'EM Prof. Otávio Rensi' },
  { id: 'esc-05', nome: 'EM Monte Alegre do Norte' },
  { id: 'esc-06', nome: 'EM Recanto dos Ipês' },
  { id: 'esc-07', nome: 'EM Prof.ª Lúcia Vieck' },
  { id: 'esc-08', nome: 'EM Campo do Sabiá' },
  { id: 'esc-09', nome: 'EM Morro da Lagoa Azul' },
  { id: 'esc-10', nome: 'EM Prof. Arno Kessler' },
  { id: 'esc-11', nome: 'EM Parque das Bromélias' },
  { id: 'esc-12', nome: 'Núcleo EJA Nova Esperança' },
  { id: 'esc-13', nome: 'EM Prof. Rui Hasse' },
  { id: 'esc-14', nome: 'EM Vila do Ribeirão' },
]

export const USERS = {
  coord: { id: 'usr-coord-07', nome: 'Ana Ribeiro', papel: 'Coordenação do CJR', email: 'ana.ribeiro@sed.example.gov.br', escopo: '7º CJR · todas as categorias' },
  juiz: { id: 'usr-juiz-12', nome: 'Carlos Menezes', papel: 'Juiz voluntário', email: 'carlos.menezes@example.com', escopo: 'Estoura Balão, Robótica Lego, Seguidor de Linha', categorias: ['estoura-balao', 'robotica-lego', 'seguidor-linha'] },
  prof: { id: 'usr-prof-31', nome: 'Prof.ª Júlia Prado', papel: 'Professora responsável', escolaId: 'esc-02', email: 'julia.prado@escola.example.gov.br', escopo: 'EM Jardim das Araucárias · 7º CJR' },
  publico: { id: 'publico', nome: 'Público', papel: 'Placar aberto, sem login' },
}
export const OUTRO_JUIZ = { id: 'usr-juiz-04', nome: 'Beatriz Lima' }

export const CATEGORIAS = [
  {
    id: 'robotica-lego', nome: 'Robótica Lego', rotulo: 'Tapete Lego', formato: 'banca',
    descricao: 'Missões em pista temática, engenharia do robô e inovação.',
    publico: { tipo: 'ano', min: 5, max: 9 }, equipe: { min: 4, max: 6, confirmado: true },
    vistoria: false, pesosConfirmados: false, regraVersao: 1,
    subcategorias: [
      { id: 'desafio', nome: 'Desafio do Robô', peso: 25 },
      { id: 'design', nome: 'Design do Robô', peso: 25 },
      { id: 'inovacao', nome: 'Projeto de Inovação', peso: 25 },
      { id: 'equipe', nome: 'Trabalho em Equipe', peso: 25 },
    ],
  },
  {
    id: 'atto-microbit', nome: 'Atto Micro:bit', rotulo: 'Micro:bit', formato: 'banca',
    descricao: 'Programação em blocos com sensores e soluções criativas.',
    publico: { tipo: 'ano', min: 5, max: 9 }, equipe: { min: 4, max: 6, confirmado: true },
    vistoria: false, pesosConfirmados: false, regraVersao: 1,
    subcategorias: [
      { id: 'desafio', nome: 'Desafio do Robô', peso: 50 },
      { id: 'inovacao', nome: 'Projeto de Inovação', peso: 50 },
    ],
  },
  {
    id: 'seguidor-linha', nome: 'Seguidor de Linha', rotulo: 'Programação', formato: 'tentativas',
    descricao: 'Navegação autônoma em pista de MDF e desvio de obstáculos.',
    publico: { tipo: 'ano', min: 6, max: 9 }, equipe: { min: 2, max: 4, confirmado: true },
    vistoria: false, pesosConfirmados: false, regraVersao: 1,
    subcategorias: [
      { id: 'percurso', nome: 'Percurso concluído', peso: 40 },
      { id: 'obstaculos', nome: 'Desvio de obstáculos', peso: 30 },
      { id: 'tempo', nome: 'Tempo de prova', peso: 30 },
    ],
  },
  {
    id: 'estoura-balao', nome: 'Estoura Balão', rotulo: 'Arena Atto', formato: 'duelos', rounds: 3,
    descricao: 'Duelos estratégicos entre robôs em arena hexagonal, em 3 rounds.',
    publico: { tipo: 'ano', min: 1, max: 5 }, equipe: { min: 2, max: 4, confirmado: false },
    vistoria: false, pesosConfirmados: true, regraVersao: 1, subcategorias: [],
  },
  {
    id: 'artbot-junior', nome: 'ArtBot Júnior', rotulo: 'Sustentável', formato: 'banca',
    descricao: 'Robôs artísticos interativos para entreter o público (ensino regular).',
    publico: { tipo: 'ano', min: 5, max: 9 }, equipe: { min: 2, max: 6, confirmado: false },
    vistoria: true, pesosConfirmados: false, regraVersao: 1,
    subcategorias: [
      { id: 'entretenimento', nome: 'Entretenimento do público', peso: 40 },
      { id: 'tema', nome: 'Relação com o tema', peso: 30 },
      { id: 'criatividade', nome: 'Criatividade e acabamento', peso: 30 },
    ],
  },
  {
    id: 'artbot-expert', nome: 'ArtBot Expert', rotulo: 'EJA', formato: 'banca',
    descricao: 'Robôs artísticos interativos para entreter o público (EJA).',
    publico: { tipo: 'eja' }, equipe: { min: 2, max: 6, confirmado: false },
    vistoria: true, pesosConfirmados: false, regraVersao: 1,
    subcategorias: [
      { id: 'entretenimento', nome: 'Entretenimento do público', peso: 40 },
      { id: 'tema', nome: 'Relação com o tema', peso: 30 },
      { id: 'criatividade', nome: 'Criatividade e acabamento', peso: 30 },
    ],
  },
  {
    id: 'tec-educacional', nome: 'Tecnologia Educacional', rotulo: 'Trabalho em sala', formato: 'banca',
    descricao: 'Projetos aplicados ao cotidiano escolar por professores e estudantes.',
    publico: { tipo: 'misto' }, equipe: { min: 2, max: 6, confirmado: false }, exigeProfessor: true,
    vistoria: false, pesosConfirmados: false, regraVersao: 1,
    subcategorias: [
      { id: 'aplicacao', nome: 'Aplicação em sala', peso: 40 },
      { id: 'poster', nome: 'Show me poster', peso: 30 },
      { id: 'prototipo', nome: 'Protótipo', peso: 30 },
    ],
  },
]

export const FORMATOS = {
  banca: 'Avaliação por banca',
  tentativas: 'Tentativas na pista',
  duelos: 'Duelos em chave',
}

// --- equipes -------------------------------------------------------------
const INICIAIS = ['A. S.', 'B. M.', 'C. R.', 'D. L.', 'E. K.', 'F. P.', 'G. T.', 'H. V.', 'I. N.', 'J. O.', 'L. W.', 'M. F.']
let n = 0
const membros = (qtd, anos) =>
  Array.from({ length: qtd }, (_, i) => ({ id: `al-${++n}`, ref: INICIAIS[(n + i) % INICIAIS.length], ano: anos[i % anos.length] }))

const eq = (id, nome, escolaId, categoriaId, integrantes) => ({
  id, nome, escolaId, categoriaId, integrantes, status: 'inscrita', professor: 'Prof. responsável (fictício)',
})

export const EQUIPES = [
  // Estoura Balão (1º ao 5º ano) — 8 equipes para a chave
  eq('eq-101', 'Capivara Bot', 'esc-01', 'estoura-balao', membros(3, ['3º', '4º'])),
  eq('eq-102', 'Faísca Azul', 'esc-02', 'estoura-balao', membros(3, ['4º', '5º'])),
  eq('eq-103', 'Pinguins de Silício', 'esc-03', 'estoura-balao', membros(2, ['2º', '3º'])),
  eq('eq-104', 'Tico-Tico Turbo', 'esc-04', 'estoura-balao', membros(4, ['5º'])),
  eq('eq-105', 'Formiguinhas Atto', 'esc-05', 'estoura-balao', membros(3, ['1º', '2º'])),
  eq('eq-106', 'Os Estourados', 'esc-06', 'estoura-balao', membros(3, ['4º'])),
  eq('eq-107', 'Bolha de Sabão', 'esc-07', 'estoura-balao', membros(2, ['3º'])),
  eq('eq-108', 'Raio Laranja', 'esc-08', 'estoura-balao', membros(4, ['5º', '4º'])),
  // Robótica Lego
  eq('eq-201', 'RoboTupã', 'esc-01', 'robotica-lego', membros(5, ['7º', '8º'])),
  eq('eq-202', 'Guardiões do Circuito', 'esc-02', 'robotica-lego', membros(6, ['6º', '7º'])),
  eq('eq-203', 'Engrenagem Viva', 'esc-04', 'robotica-lego', membros(4, ['9º'])),
  eq('eq-204', 'Byte Lobos', 'esc-06', 'robotica-lego', membros(5, ['5º', '6º'])),
  eq('eq-205', 'Mecatrônicos', 'esc-09', 'robotica-lego', membros(6, ['8º', '9º'])),
  eq('eq-206', 'NeuroBlocos', 'esc-10', 'robotica-lego', membros(4, ['6º'])),
  // Atto Micro:bit
  eq('eq-301', 'Micro Maré', 'esc-03', 'atto-microbit', membros(4, ['6º'])),
  eq('eq-302', 'Código Ipê', 'esc-06', 'atto-microbit', membros(5, ['7º'])),
  eq('eq-303', 'Sinal Verde', 'esc-07', 'atto-microbit', membros(4, ['5º', '6º'])),
  eq('eq-304', 'Bit a Bit', 'esc-11', 'atto-microbit', membros(6, ['8º'])),
  eq('eq-305', 'Pulsar', 'esc-02', 'atto-microbit', membros(4, ['9º'])),
  // Seguidor de Linha
  eq('eq-401', 'Linha Reta', 'esc-04', 'seguidor-linha', membros(3, ['8º'])),
  eq('eq-402', 'Trilha Branca', 'esc-05', 'seguidor-linha', membros(2, ['9º'])),
  eq('eq-403', 'Rastro Rápido', 'esc-08', 'seguidor-linha', membros(4, ['6º', '7º'])),
  eq('eq-404', 'Sensor Fino', 'esc-09', 'seguidor-linha', membros(3, ['7º'])),
  eq('eq-405', 'Curva Zero', 'esc-10', 'seguidor-linha', membros(2, ['8º'])),
  eq('eq-406', 'Seta Norte', 'esc-11', 'seguidor-linha', membros(4, ['9º'])),
  // ArtBot Júnior
  eq('eq-501', 'Ferro & Flor', 'esc-03', 'artbot-junior', membros(4, ['6º'])),
  eq('eq-502', 'Girassol Mecânico', 'esc-07', 'artbot-junior', membros(3, ['5º'])),
  eq('eq-503', 'Baleia Reciclada', 'esc-11', 'artbot-junior', membros(5, ['8º'])),
  eq('eq-504', 'Carrossel Solar', 'esc-02', 'artbot-junior', membros(4, ['7º'])),
  // ArtBot Expert (EJA)
  eq('eq-601', 'Engenho Noturno', 'esc-12', 'artbot-expert', membros(4, ['EJA'])),
  eq('eq-602', 'Ateliê EJA', 'esc-12', 'artbot-expert', membros(3, ['EJA'])),
  eq('eq-603', 'Volta ao Mundo', 'esc-12', 'artbot-expert', membros(5, ['EJA'])),
  // Tecnologia Educacional (professores + estudantes)
  eq('eq-701', 'Lousa Viva', 'esc-01', 'tec-educacional', [...membros(1, ['Professor']), ...membros(3, ['8º'])]),
  eq('eq-702', 'Horta Conectada', 'esc-05', 'tec-educacional', [...membros(1, ['Professor']), ...membros(2, ['6º'])]),
  eq('eq-703', 'Mapa Tátil 3D', 'esc-09', 'tec-educacional', [...membros(2, ['Professor']), ...membros(2, ['9º'])]),
]

// --- avaliações iniciais ---------------------------------------------------
export const totalPonderado = (cat, notas) =>
  Math.round(cat.subcategorias.reduce((s, sc) => s + ((Number(notas[sc.id]) || 0) / 10) * sc.peso, 0) * 10) / 10

const BASE = Date.now() - 3 * 3600e3 // linha do tempo relativa ao momento da demo
const hora = (min) => new Date(BASE + min * 60000).toISOString()

let av = 0
const avaliacao = (categoriaId, equipeId, notas, status, juiz, min) => {
  const cat = CATEGORIAS.find((c) => c.id === categoriaId)
  const total = totalPonderado(cat, notas)
  const homolog = status === 'homologado'
  return {
    id: `av-${String(++av).padStart(3, '0')}`, categoriaId, equipeId, partidaId: null,
    juiz, notas, total, obs: '', vistoria: cat.vistoria ? true : undefined,
    status, versao: 1, regraVersao: 1, criadoEm: hora(min),
    homologadoPor: homolog ? USERS.coord.nome : null, homologadoEm: homolog ? hora(min + 12) : null,
    historico: [],
  }
}
const C = USERS.juiz.nome, B = OUTRO_JUIZ.nome

export const AVALIACOES = [
  avaliacao('robotica-lego', 'eq-201', { desafio: 9, design: 8, inovacao: 9, equipe: 9 }, 'homologado', C, 10),
  avaliacao('robotica-lego', 'eq-202', { desafio: 8, design: 9, inovacao: 7, equipe: 9 }, 'homologado', B, 25),
  avaliacao('robotica-lego', 'eq-203', { desafio: 7, design: 7, inovacao: 8, equipe: 8 }, 'homologado', C, 40),
  avaliacao('robotica-lego', 'eq-204', { desafio: 8, design: 6, inovacao: 9, equipe: 7 }, 'homologado', B, 55),
  avaliacao('robotica-lego', 'eq-205', { desafio: 9, design: 9, inovacao: 8, equipe: 8 }, 'pendente', B, 70),
  avaliacao('seguidor-linha', 'eq-401', { percurso: 10, obstaculos: 8, tempo: 9 }, 'homologado', C, 15),
  avaliacao('seguidor-linha', 'eq-402', { percurso: 9, obstaculos: 9, tempo: 7 }, 'homologado', C, 30),
  avaliacao('seguidor-linha', 'eq-403', { percurso: 8, obstaculos: 7, tempo: 10 }, 'homologado', B, 45),
  avaliacao('atto-microbit', 'eq-301', { desafio: 8, inovacao: 9 }, 'homologado', B, 20),
  avaliacao('atto-microbit', 'eq-302', { desafio: 9, inovacao: 7 }, 'homologado', C, 35),
  avaliacao('atto-microbit', 'eq-303', { desafio: 7, inovacao: 9 }, 'pendente', B, 80),
  avaliacao('artbot-junior', 'eq-501', { entretenimento: 9, tema: 9, criatividade: 8 }, 'homologado', B, 50),
  avaliacao('artbot-junior', 'eq-502', { entretenimento: 8, tema: 9, criatividade: 9 }, 'homologado', C, 65),
  avaliacao('artbot-expert', 'eq-601', { entretenimento: 9, tema: 8, criatividade: 9 }, 'homologado', B, 60),
  avaliacao('tec-educacional', 'eq-701', { aplicacao: 9, poster: 8, prototipo: 9 }, 'homologado', C, 75),
  avaliacao('tec-educacional', 'eq-702', { aplicacao: 8, poster: 9, prototipo: 7 }, 'pendente', B, 90),
]

export const AUDITORIA = [
  { id: 'aud-003', em: hora(-60), ator: USERS.coord.nome, acao: 'Abriu as disputas', entidade: 'Edição', ref: EDICAO.id, detalhe: 'Regras v1 congeladas em todas as categorias' },
  { id: 'aud-002', em: hora(-24 * 60), ator: 'Integração · Desafio 01', acao: 'Sincronizou dados mestres', entidade: 'Edição', ref: EDICAO.id, detalhe: '14 escolas e dados da edição recebidos' },
  { id: 'aud-001', em: hora(-26 * 60), ator: USERS.coord.nome, acao: 'Publicou regras v1', entidade: 'Regras', ref: 'todas', detalhe: '7 categorias configuradas' },
]

export const EVENTOS = [
  {
    id: 'evt-001', tipo: 'edicao.atualizada', direcao: 'entrada', origem: 'Desafio 01', em: hora(-24 * 60), status: 'processado',
    payload: { evento: 'edicao.atualizada', edicao_id: EDICAO.id, ano: EDICAO.ano, escolas: 14 },
  },
]

// --- acessos por edição (convites com escopo) -------------------------------
// Acesso é por PESSOA, vinculado a uma escola ou a categorias, e expira com a edição.
const RESP = ['Helena Duarte', 'Júlia Prado', 'Renata Oliveira', 'Paulo Schmidt', 'Luana Costa', 'Diego Ramos', 'Sônia Krüger', 'André Lopes', 'Fernanda Melo', 'Tiago Bauer', 'Camila Reis', 'Marta Vogel', 'Bruno Seidel', '']
const STATUS = ['aceito', 'aceito', 'aceito', 'aceito', 'aceito', 'aceito', 'aceito', 'aceito', 'aceito', 'aceito', 'aceito', 'aceito', 'enviado', 'nao-convidado']
const slug = (n) => n.toLowerCase().normalize('NFD').replace(/[^a-z ]/g, '').replace(' ', '.')
export const ACESSOS_ESCOLAS = ESCOLAS.map((e, i) => {
  const responsavel = RESP[i]
  return { escolaId: e.id, responsavel, email: responsavel ? `${slug(responsavel)}@escola.example.gov.br` : '', status: STATUS[i] }
})
export const ACESSOS_JUIZES = [
  { id: 'usr-juiz-12', nome: 'Carlos Menezes', email: 'carlos.menezes@example.com', categorias: ['estoura-balao', 'robotica-lego', 'seguidor-linha'], status: 'aceito' },
  { id: 'usr-juiz-04', nome: 'Beatriz Lima', email: 'beatriz.lima@example.com', categorias: ['robotica-lego', 'atto-microbit', 'artbot-junior', 'artbot-expert', 'tec-educacional'], status: 'aceito' },
  { id: 'usr-juiz-15', nome: 'Rafael Nunes', email: 'rafael.nunes@example.com', categorias: ['seguidor-linha', 'estoura-balao'], status: 'enviado' },
]
