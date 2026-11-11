import React, { useMemo, useState } from 'react'
import { Plus, Trash2, UserPlus, ShieldCheck, Search, XCircle, CheckCircle2, Lock } from 'lucide-react'
import { useApp } from '../App.jsx'
import { Button, Card, Field, Modal, PageHeader, Tag, cx, inputBase, inputCls } from '../components/ui.jsx'
import { USERS } from '../data/seed.js'
import { elegibilidade } from '../state/store.js'
import { publicoTxt } from './Painel.jsx'

const ANOS = ['1º', '2º', '3º', '4º', '5º', '6º', '7º', '8º', '9º', 'EJA', 'Professor']

function NovaInscricao({ onClose, escolaFixa }) {
  const { state, dispatch, notify } = useApp()
  const [escolaId, setEscolaId] = useState(escolaFixa || 'esc-02')
  const [categoriaId, setCategoriaId] = useState('seguidor-linha')
  const [nome, setNome] = useState('Robôs do Ipê')
  const [membros, setMembros] = useState([
    { ref: 'L. M.', ano: '7º' },
    { ref: 'R. A.', ano: '5º' },
  ])
  const cat = state.categorias.find((c) => c.id === categoriaId)
  const eleg = elegibilidade(cat, membros)
  const nomeErro = !nome.trim() ? 'Dê um nome à equipe' : state.equipes.some((e) => e.nome.toLowerCase() === nome.trim().toLowerCase()) ? 'Já existe uma equipe com esse nome nesta edição' : null
  const ok = eleg.ok && !nomeErro

  const upd = (i, k, v) => setMembros(membros.map((m, j) => (j === i ? { ...m, [k]: v } : m)))
  const salvar = () => {
    dispatch({ type: 'ADD_TEAM', equipe: { nome: nome.trim(), escolaId, categoriaId, integrantes: membros.map((m, i) => ({ id: `novo-${i}`, ...m })), professor: USERS.prof.nome } })
    notify(`Equipe ${nome.trim()} inscrita em ${cat.nome}`)
    onClose()
  }

  return (
    <Modal title="Nova inscrição" onClose={onClose}
      footer={<><Button variant="secondary" onClick={onClose}>Cancelar</Button><Button icon={CheckCircle2} disabled={!ok} onClick={salvar}>Confirmar inscrição</Button></>}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Escola" id="ins-escola" hint={escolaFixa ? 'Seu acesso é restrito à sua escola' : 'Lista recebida da Gestão do Evento'}>
          <select id="ins-escola" className={inputCls} value={escolaId} onChange={(e) => setEscolaId(e.target.value)} disabled={!!escolaFixa}>
            {state.escolas.map((e) => <option key={e.id} value={e.id}>{e.nome}</option>)}
          </select>
        </Field>
        <Field label="Categoria" id="ins-cat" hint={`${publicoTxt(cat.publico)} · ${cat.equipe.min} a ${cat.equipe.max} integrantes`}>
          <select id="ins-cat" className={inputCls} value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)}>
            {state.categorias.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
        </Field>
        <div className="sm:col-span-2">
          <Field label="Nome da equipe" id="ins-nome" error={nomeErro}>
            <input id="ins-nome" className={inputCls} value={nome} onChange={(e) => setNome(e.target.value)} />
          </Field>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[13px] font-semibold">Integrantes</p>
          <span className={cx('rounded-full px-2 py-0.5 text-[12.5px] font-semibold tnum', membros.length >= cat.equipe.min && membros.length <= cat.equipe.max ? 'bg-good-soft text-good' : 'bg-warn-soft text-warn')}>
            {membros.length} de {cat.equipe.min} a {cat.equipe.max}
          </span>
        </div>
        <ul className="flex flex-col gap-2">
          {membros.map((m, i) => (
            <li key={i} className={cx('rounded-md border p-2', eleg.porMembro[i] ? 'border-crit/50 bg-crit-soft/40' : 'border-line')}>
              <div className="flex items-center gap-2">
                <label className="sr-only" htmlFor={`m-ref-${i}`}>Iniciais do integrante {i + 1}</label>
                <input id={`m-ref-${i}`} className={cx(inputCls, 'h-9 min-w-0 flex-1')} value={m.ref} onChange={(e) => upd(i, 'ref', e.target.value)} placeholder="Iniciais" />
                <label className="sr-only" htmlFor={`m-ano-${i}`}>Ano escolar do integrante {i + 1}</label>
                <select id={`m-ano-${i}`} className={cx(inputBase, 'h-9 w-32 shrink-0')} value={m.ano} onChange={(e) => upd(i, 'ano', e.target.value)}>
                  {ANOS.map((a) => <option key={a} value={a}>{a === 'EJA' || a === 'Professor' ? a : `${a} ano`}</option>)}
                </select>
                <button onClick={() => setMembros(membros.filter((_, j) => j !== i))} className="rounded p-2 text-muted hover:bg-sunken hover:text-crit" aria-label={`Remover integrante ${i + 1}`}><Trash2 size={16} /></button>
              </div>
              {eleg.porMembro[i] && <p className="mt-1 flex items-center gap-1 text-[12.5px] font-medium text-crit"><XCircle size={14} />{eleg.porMembro[i]}</p>}
            </li>
          ))}
        </ul>
        <Button variant="ghost" size="sm" icon={Plus} className="mt-2" onClick={() => setMembros([...membros, { ref: '', ano: cat.publico.tipo === 'eja' ? 'EJA' : '7º' }])} disabled={membros.length >= cat.equipe.max}>
          Adicionar integrante
        </Button>
      </div>

      <div className={cx('mt-4 rounded-md px-3 py-2.5 text-[13.5px]', ok ? 'bg-good-soft text-good' : 'bg-crit-soft text-crit')} role="status">
        {ok ? (
          <p className="flex items-center gap-1.5 font-semibold"><CheckCircle2 size={16} />Equipe elegível para {cat.nome}</p>
        ) : (
          <ul className="flex flex-col gap-0.5">{[...eleg.erros, ...(nomeErro ? [nomeErro] : [])].map((e) => <li key={e} className="flex items-center gap-1.5 font-medium"><XCircle size={14} className="shrink-0" />{e}</li>)}</ul>
        )}
      </div>
      <p className="mt-3 flex items-start gap-1.5 text-[12px] text-muted"><ShieldCheck size={14} className="mt-0.5 shrink-0" />LGPD: o módulo guarda só iniciais e ano escolar. Em produção, esses dados viriam do cadastro da rede, com o mínimo necessário.</p>
    </Modal>
  )
}

export default function Inscricoes() {
  const { state } = useApp()
  const isProf = state.role === 'prof'
  const escolaFixa = isProf ? USERS.prof.escolaId : null
  const [filtro, setFiltro] = useState('todas')
  const [busca, setBusca] = useState('')
  const [aberto, setAberto] = useState(false)
  const escNome = (id) => state.escolas.find((e) => e.id === id)?.nome
  const catNome = (id) => state.categorias.find((c) => c.id === id)?.nome

  const lista = useMemo(() => state.equipes
    .filter((e) => !escolaFixa || e.escolaId === escolaFixa)
    .filter((e) => filtro === 'todas' || e.categoriaId === filtro)
    .filter((e) => !busca || `${e.nome} ${escNome(e.escolaId)}`.toLowerCase().includes(busca.toLowerCase())), [state.equipes, filtro, busca, escolaFixa])

  return (
    <div>
      <PageHeader eyebrow={isProf ? escNome(escolaFixa) : 'Participação'} title={isProf ? 'Inscrições da minha escola' : 'Inscrições de equipes'}
        actions={<Button icon={UserPlus} onClick={() => setAberto(true)}>Nova inscrição</Button>}>
        A elegibilidade é validada na hora: ano escolar de cada integrante e limite de integrantes da categoria.
      </PageHeader>
      {isProf && <p className="mb-4 flex items-center gap-1.5 rounded-md bg-sunken px-3 py-2 text-[13px] text-muted"><Lock size={14} />Acesso restrito: você vê e inscreve apenas equipes da sua escola.</p>}

      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center gap-2 border-b border-line p-3">
          <div className="relative min-w-0 flex-1 sm:max-w-xs">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
            <label htmlFor="busca-eq" className="sr-only">Buscar equipe ou escola</label>
            <input id="busca-eq" className={cx(inputCls, 'pl-9')} placeholder="Buscar equipe ou escola" value={busca} onChange={(e) => setBusca(e.target.value)} />
          </div>
          <label htmlFor="filtro-cat" className="sr-only">Filtrar por categoria</label>
          <select id="filtro-cat" className={cx(inputBase, 'w-auto max-w-full')} value={filtro} onChange={(e) => setFiltro(e.target.value)}>
            <option value="todas">Todas as categorias</option>
            {state.categorias.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
          <span className="ml-auto text-[13px] text-muted tnum">{lista.length} equipes</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-[13.5px]">
            <thead className="bg-sunken text-[12px] uppercase tracking-wide text-muted">
              <tr><th className="px-4 py-2 font-semibold">Equipe</th><th className="px-3 py-2 font-semibold">Escola</th><th className="px-3 py-2 font-semibold">Categoria</th><th className="px-3 py-2 font-semibold">Integrantes</th><th className="px-4 py-2 font-semibold">Situação</th></tr>
            </thead>
            <tbody>
              {lista.map((e) => (
                <tr key={e.id} className="border-t border-line">
                  <td className="px-4 py-2.5 font-semibold">{e.nome}</td>
                  <td className="px-3 py-2.5 text-muted">{escNome(e.escolaId)}</td>
                  <td className="px-3 py-2.5">{catNome(e.categoriaId)}</td>
                  <td className="px-3 py-2.5 text-muted"><span className="font-semibold text-ink tnum">{e.integrantes.length}</span> · {[...new Set(e.integrantes.map((m) => m.ano))].join(', ')}</td>
                  <td className="px-4 py-2.5"><Tag tone="primary"><CheckCircle2 size={12} />Elegível</Tag></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      {aberto && <NovaInscricao onClose={() => setAberto(false)} escolaFixa={escolaFixa} />}
    </div>
  )
}
