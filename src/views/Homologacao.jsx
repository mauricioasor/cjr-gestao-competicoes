import React, { useState } from 'react'
import { BadgeCheck, Undo2, PencilLine, ShieldCheck, Inbox, History } from 'lucide-react'
import { useApp } from '../App.jsx'
import { Button, Card, Empty, Field, Modal, PageHeader, StatusPill, Tag, cx, fmtHora, inputBase, inputCls } from '../components/ui.jsx'
import { USERS, totalPonderado } from '../data/seed.js'

const titulo = (state, a) => {
  if (a.partidaId) {
    const A = state.equipes.find((e) => e.id === a.equipeA), B = state.equipes.find((e) => e.id === a.equipeB)
    return `${A?.nome} × ${B?.nome}`
  }
  return state.equipes.find((e) => e.id === a.equipeId)?.nome
}

function Valores({ state, a, cat }) {
  if (a.partidaId) {
    return (
      <div className="flex flex-wrap gap-2">
        {a.rounds.map((r, i) => <Tag key={i}>R{i + 1}: {r.a} × {r.b}</Tag>)}
        <Tag tone="primary">Total {a.totalA} × {a.totalB} · vence {state.equipes.find((e) => e.id === (a.vencedor === 'a' ? a.equipeA : a.equipeB))?.nome}</Tag>
      </div>
    )
  }
  return (
    <div className="flex flex-wrap gap-2">
      {cat.subcategorias.map((s) => <Tag key={s.id}>{s.nome}: {a.notas[s.id]}</Tag>)}
      {a.vistoria && <Tag tone="primary">Vistoria aprovada</Tag>}
    </div>
  )
}

function Pendente({ a }) {
  const { state, dispatch, notify } = useApp()
  const cat = state.categorias.find((c) => c.id === a.categoriaId)
  const [devolver, setDevolver] = useState(false)
  const [motivo, setMotivo] = useState('')
  const proprio = a.juiz === USERS[state.role].nome
  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[12px] font-semibold uppercase tracking-wide text-muted">{cat.nome}{a.rotulo && ` · ${a.rotulo}`}</p>
          <p className="text-[17px] font-semibold">{titulo(state, a)}</p>
          <p className="text-[12.5px] text-muted">Lançado por {a.juiz} às {fmtHora(a.criadoEm)} · regras v{a.regraVersao}</p>
        </div>
        {!a.partidaId && <p className="font-display text-3xl font-semibold tnum">{a.total.toFixed(1)}</p>}
      </div>
      <div className="mt-3"><Valores state={state} a={a} cat={cat} /></div>
      {a.obs && <p className="mt-2 text-[13px] text-muted">Obs. do juiz: {a.obs}</p>}

      {proprio ? (
        <p className="mt-3 rounded-md bg-warn-soft px-3 py-2 text-[13px] font-medium text-warn">Você lançou esta nota. Outra pessoa precisa homologar.</p>
      ) : devolver ? (
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end">
          <div className="min-w-0 flex-1">
            <Field label="Motivo da devolução" id={`dev-${a.id}`}><input id={`dev-${a.id}`} className={inputCls} value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Ex.: conferir a nota de Design do Robô" /></Field>
          </div>
          <Button variant="secondary" onClick={() => setDevolver(false)}>Cancelar</Button>
          <Button variant="danger" icon={Undo2} disabled={motivo.trim().length < 5} onClick={() => { dispatch({ type: 'RETURN', id: a.id, motivo: motivo.trim() }); notify('Avaliação devolvida ao juiz') }}>Devolver</Button>
        </div>
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          <Button variant="good" icon={BadgeCheck} onClick={() => { dispatch({ type: 'HOMOLOGATE', id: a.id }); notify(`Resultado homologado: ${titulo(state, a)} já aparece no placar público`) }}>Homologar e publicar</Button>
          <Button variant="secondary" icon={Undo2} onClick={() => setDevolver(true)}>Devolver ao juiz</Button>
        </div>
      )}
    </Card>
  )
}

function Corrigir({ a, onClose }) {
  const { state, dispatch, notify } = useApp()
  const cat = state.categorias.find((c) => c.id === a.categoriaId)
  const [notas, setNotas] = useState(a.notas || {})
  const [rounds, setRounds] = useState(a.rounds || [])
  const [vencedor, setVencedor] = useState(a.vencedor)
  const [motivo, setMotivo] = useState('')
  const novoTotal = a.partidaId ? null : totalPonderado(cat, notas)
  const mudou = a.partidaId ? JSON.stringify(rounds) !== JSON.stringify(a.rounds) || vencedor !== a.vencedor : JSON.stringify(notas) !== JSON.stringify(a.notas)
  const ok = mudou && motivo.trim().length >= 8
  const salvar = () => {
    dispatch({ type: 'CORRECT', id: a.id, notas, rounds, vencedor, motivo: motivo.trim() })
    notify(`Correção publicada como versão ${a.versao + 1}. A versão anterior continua na auditoria.`)
    onClose()
  }
  return (
    <Modal title={`Corrigir resultado · ${titulo(state, a)}`} onClose={onClose}
      footer={<><Button variant="secondary" onClick={onClose}>Cancelar</Button><Button icon={PencilLine} disabled={!ok} onClick={salvar}>Publicar versão {a.versao + 1}</Button></>}>
      <p className="mb-3 rounded-md bg-info-soft px-3 py-2 text-[13px] text-info">Resultado homologado não é editado. A correção cria a versão {a.versao + 1}, avisa o Histórico Público e mantém a versão {a.versao} na trilha de auditoria.</p>
      {a.partidaId ? (
        <div className="flex flex-col gap-2">
          {rounds.map((r, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="w-20 font-semibold">Round {i + 1}</span>
              {['a', 'b'].map((k) => (
                <input key={k} type="number" min="0" aria-label={`Round ${i + 1}, equipe ${k.toUpperCase()}`} className={cx(inputBase, 'w-20 text-center tnum')} value={r[k]}
                  onChange={(e) => setRounds(rounds.map((x, j) => (j === i ? { ...x, [k]: Number(e.target.value) || 0 } : x)))} />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {cat.subcategorias.map((s) => (
            <div key={s.id} className="flex items-center gap-3">
              <label htmlFor={`cor-${s.id}`} className="min-w-0 flex-1">{s.nome}</label>
              <span className="text-[12.5px] text-muted tnum">era {a.notas[s.id]}</span>
              <input id={`cor-${s.id}`} type="number" min="0" max="10" className={cx(inputBase, 'w-20 text-center tnum')} value={notas[s.id]}
                onChange={(e) => setNotas({ ...notas, [s.id]: Math.min(10, Math.max(0, Number(e.target.value) || 0)) })} />
            </div>
          ))}
          <p className="mt-1 text-right">Total: <span className="text-muted line-through tnum">{a.total.toFixed(1)}</span> → <strong className="tnum">{novoTotal.toFixed(1)}</strong></p>
        </div>
      )}
      <div className="mt-4">
        <Field label="Motivo da correção (obrigatório)" id="motivo-cor" hint="Ex.: erro de digitação conferido na súmula em papel do juiz">
          <textarea id="motivo-cor" rows={2} className={cx(inputCls, 'h-auto py-2')} value={motivo} onChange={(e) => setMotivo(e.target.value)} />
        </Field>
      </div>
    </Modal>
  )
}

export default function Homologacao() {
  const { state } = useApp()
  const [corrigir, setCorrigir] = useState(null)
  const pend = state.avaliacoes.filter((a) => a.status === 'pendente')
  const homol = state.avaliacoes.filter((a) => a.status === 'homologado').sort((x, y) => (y.homologadoEm || '').localeCompare(x.homologadoEm || ''))
  return (
    <div>
      <PageHeader eyebrow="Validação oficial" title="Homologação de resultados">
        Revise o que os juízes lançaram. Ao homologar, o resultado entra no placar público e é enviado ao Histórico Público.
      </PageHeader>
      <p className="mb-5 flex items-center gap-2 rounded-lg border border-primary/30 bg-primary-soft px-4 py-3 text-[14px] text-primary"><ShieldCheck size={18} className="shrink-0" />Segregação de funções: quem lança a nota não pode homologá-la.</p>

      <h2 className="mb-3 flex items-center gap-2 font-display text-xl font-semibold">Aguardando homologação <span className="rounded-full bg-warn-soft px-2 text-[13px] text-warn tnum">{pend.length}</span></h2>
      {pend.length === 0 ? (
        <Card className="mb-6"><Empty icon={Inbox} title="Nada pendente">Quando um juiz enviar uma nota, ela aparece aqui.</Empty></Card>
      ) : (
        <div className="mb-6 grid gap-3 lg:grid-cols-2">{pend.map((a) => <Pendente key={a.id} a={a} />)}</div>
      )}

      <h2 className="mb-3 font-display text-xl font-semibold">Resultados oficiais</h2>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-[13.5px]">
            <thead className="bg-sunken text-[12px] uppercase tracking-wide text-muted">
              <tr><th className="px-4 py-2 font-semibold">Resultado</th><th className="px-3 py-2 font-semibold">Categoria</th><th className="px-3 py-2 text-right font-semibold">Total</th><th className="px-3 py-2 font-semibold">Situação</th><th className="px-3 py-2 font-semibold">Homologado por</th><th className="px-4 py-2" /></tr>
            </thead>
            <tbody>
              {homol.map((a) => (
                <tr key={a.id} className="border-t border-line">
                  <td className="px-4 py-2.5 font-semibold">{titulo(state, a)}</td>
                  <td className="px-3 py-2.5 text-muted">{state.categorias.find((c) => c.id === a.categoriaId)?.nome}</td>
                  <td className="px-3 py-2.5 text-right font-semibold tnum">{a.partidaId ? `${a.totalA} × ${a.totalB}` : a.total.toFixed(1)}</td>
                  <td className="px-3 py-2.5"><StatusPill status={a.status} versao={a.versao} /></td>
                  <td className="px-3 py-2.5 text-muted">{a.homologadoPor} · {fmtHora(a.homologadoEm)}{a.historico.length > 0 && <span className="ml-1 inline-flex items-center gap-0.5 text-info"><History size={12} />{a.historico.length}</span>}</td>
                  <td className="px-4 py-2.5 text-right"><Button size="sm" variant="secondary" icon={PencilLine} onClick={() => setCorrigir(a)}>Corrigir</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      {corrigir && <Corrigir a={corrigir} onClose={() => setCorrigir(null)} />}
    </div>
  )
}
