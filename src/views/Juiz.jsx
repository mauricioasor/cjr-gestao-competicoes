import React, { useState } from 'react'
import { Minus, Plus, Send, ArrowLeft, ShieldCheck, GitFork, Gavel, AlertTriangle, ChevronRight } from 'lucide-react'
import { useApp } from '../App.jsx'
import { Button, Card, Empty, PageHeader, StatusPill, cx, inputCls } from '../components/ui.jsx'
import { USERS, totalPonderado } from '../data/seed.js'
import { montarChave } from '../state/store.js'

function Stepper({ id, label, value, onChange, max = 10, sub }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="min-w-0 flex-1">
        <label htmlFor={id} className="font-semibold">{label}</label>
        {sub && <p className="text-[12px] text-muted">{sub}</p>}
      </div>
      <button type="button" onClick={() => onChange(Math.max(0, value - 1))} className="grid h-11 w-11 place-items-center rounded-md border border-line bg-surface hover:bg-sunken" aria-label={`Diminuir ${label}`}><Minus size={18} /></button>
      <input id={id} type="number" min="0" max={max} value={value} onChange={(e) => onChange(Math.min(max, Math.max(0, Number(e.target.value) || 0)))}
        className="h-11 w-16 rounded-md border border-line bg-surface text-center font-display text-2xl font-semibold tnum" />
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} className="grid h-11 w-11 place-items-center rounded-md border border-line bg-surface hover:bg-sunken" aria-label={`Aumentar ${label}`}><Plus size={18} /></button>
    </div>
  )
}

function FormBanca({ cat, equipe, onDone }) {
  const { dispatch, notify } = useApp()
  const [notas, setNotas] = useState(() => Object.fromEntries(cat.subcategorias.map((s) => [s.id, 7])))
  const [vistoria, setVistoria] = useState(false)
  const [obs, setObs] = useState('')
  const [revisar, setRevisar] = useState(false)
  const total = totalPonderado(cat, notas)
  const bloqueio = cat.vistoria && !vistoria ? 'Confirme a vistoria de segurança antes de avaliar' : null

  const enviar = () => {
    dispatch({ type: 'SUBMIT_EVAL', avaliacao: { categoriaId: cat.id, equipeId: equipe.id, partidaId: null, notas, total, obs, vistoria: cat.vistoria ? vistoria : undefined } })
    notify(`Nota de ${equipe.nome} enviada para homologação`)
    onDone()
  }

  return (
    <Card className="p-5">
      <button onClick={onDone} className="mb-3 flex items-center gap-1 text-[13px] font-semibold text-primary"><ArrowLeft size={15} />Voltar à lista</button>
      <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-muted">{cat.nome} · regras v{cat.regraVersao}</p>
      <h2 className="font-display text-2xl font-semibold">{equipe.nome}</h2>

      {!revisar ? (
        <>
          {cat.vistoria && (
            <label className={cx('mt-4 flex items-start gap-3 rounded-md border p-3', vistoria ? 'border-good/50 bg-good-soft' : 'border-warn/50 bg-warn-soft')}>
              <input type="checkbox" id="vistoria" className="mt-1 h-5 w-5" checked={vistoria} onChange={(e) => setVistoria(e.target.checked)} />
              <span><strong>Vistoria de segurança aprovada</strong><br /><span className="text-[13px]">Sem partes afiadas, pontiagudas ou risco de esmagamento; ao menos uma parte móvel.</span></span>
            </label>
          )}
          <div className="mt-3 divide-y divide-line">
            {cat.subcategorias.map((s) => (
              <Stepper key={s.id} id={`nota-${s.id}`} label={s.nome} sub={`peso ${s.peso}% · nota de 0 a 10`} value={notas[s.id]} onChange={(v) => setNotas({ ...notas, [s.id]: v })} />
            ))}
          </div>
          <label htmlFor="obs" className="mt-3 block text-[13px] font-semibold">Observações</label>
          <textarea id="obs" rows={2} className={cx(inputCls, 'mt-1 h-auto py-2')} value={obs} onChange={(e) => setObs(e.target.value)} placeholder="Ex.: robô completou 6 de 8 missões" />
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-md bg-sunken px-4 py-3">
            <span className="text-muted">Total ponderado</span>
            <span className="font-display text-3xl font-semibold tnum">{total.toFixed(1)}<span className="text-base text-muted"> / 100</span></span>
          </div>
          {bloqueio && <p className="mt-2 flex items-center gap-1.5 text-[13px] font-medium text-warn"><AlertTriangle size={15} />{bloqueio}</p>}
          <Button size="lg" className="mt-4 w-full" disabled={!!bloqueio} onClick={() => setRevisar(true)}>Revisar antes de enviar</Button>
        </>
      ) : (
        <>
          <dl className="mt-4 divide-y divide-line rounded-md border border-line">
            {cat.subcategorias.map((s) => (
              <div key={s.id} className="flex justify-between px-4 py-2"><dt>{s.nome}</dt><dd className="font-semibold tnum">{notas[s.id]}</dd></div>
            ))}
            <div className="flex justify-between bg-sunken px-4 py-2.5"><dt className="font-semibold">Total</dt><dd className="font-display text-xl font-semibold tnum">{total.toFixed(1)}</dd></div>
          </dl>
          {obs && <p className="mt-2 text-[13px] text-muted">Obs.: {obs}</p>}
          <p className="mt-3 flex items-start gap-1.5 text-[13px] text-muted"><ShieldCheck size={15} className="mt-0.5 shrink-0" />Depois de enviada, a nota vai para a coordenação homologar. O placar público só muda após a homologação.</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button variant="secondary" size="lg" onClick={() => setRevisar(false)}>Editar</Button>
            <Button size="lg" icon={Send} onClick={enviar}>Enviar</Button>
          </div>
        </>
      )}
    </Card>
  )
}

function FormDuelo({ cat, partida, equipes, onDone }) {
  const { dispatch, notify } = useApp()
  const A = equipes.find((e) => e.id === partida.a), B = equipes.find((e) => e.id === partida.b)
  const [rounds, setRounds] = useState(() => Array.from({ length: cat.rounds }, () => ({ a: 0, b: 0 })))
  const [vencedorEmpate, setVencedorEmpate] = useState(null)
  const [obs, setObs] = useState('')
  const totalA = rounds.reduce((s, r) => s + r.a, 0), totalB = rounds.reduce((s, r) => s + r.b, 0)
  const empate = totalA === totalB
  const vencedor = empate ? vencedorEmpate : totalA > totalB ? 'a' : 'b'
  const pronto = vencedor && (!empate || obs.trim().length >= 5)
  const rotulo = `${partida.nomeFase} · jogo ${partida.idx + 1}`
  const upd = (i, k, v) => setRounds(rounds.map((r, j) => (j === i ? { ...r, [k]: v } : r)))

  const enviar = () => {
    dispatch({ type: 'SUBMIT_EVAL', avaliacao: { categoriaId: cat.id, equipeId: null, partidaId: partida.id, rotulo, equipeA: A.id, equipeB: B.id, rounds, totalA, totalB, vencedor, obs } })
    notify(`Placar do duelo ${A.nome} × ${B.nome} enviado para homologação`)
    onDone()
  }

  return (
    <Card className="p-5">
      <button onClick={onDone} className="mb-3 flex items-center gap-1 text-[13px] font-semibold text-primary"><ArrowLeft size={15} />Voltar à chave</button>
      <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-muted">{cat.nome} · {rotulo}</p>
      <h2 className="font-display text-2xl font-semibold">{A.nome} × {B.nome}</h2>
      <p className="text-[13px] text-muted">Balões estourados por round</p>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[420px]">
          <thead><tr className="text-[12px] uppercase tracking-wide text-muted"><th className="pb-2 text-left font-semibold">Round</th><th className="pb-2 font-semibold">{A.nome}</th><th className="pb-2 font-semibold">{B.nome}</th></tr></thead>
          <tbody>
            {rounds.map((r, i) => (
              <tr key={i} className="border-t border-line">
                <td className="py-2 font-semibold">{i + 1}º</td>
                {['a', 'b'].map((k) => (
                  <td key={k} className="py-2">
                    <div className="flex items-center justify-center gap-1.5">
                      <button type="button" onClick={() => upd(i, k, Math.max(0, r[k] - 1))} className="grid h-10 w-10 place-items-center rounded-md border border-line hover:bg-sunken" aria-label={`Menos um balão, ${k === 'a' ? A.nome : B.nome}, round ${i + 1}`}><Minus size={16} /></button>
                      <span className="w-8 text-center font-display text-2xl font-semibold tnum" aria-live="polite">{r[k]}</span>
                      <button type="button" onClick={() => upd(i, k, Math.min(12, r[k] + 1))} className="grid h-10 w-10 place-items-center rounded-md border border-line hover:bg-sunken" aria-label={`Mais um balão, ${k === 'a' ? A.nome : B.nome}, round ${i + 1}`}><Plus size={16} /></button>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
            <tr className="border-t-2 border-line bg-sunken">
              <td className="px-2 py-2 font-semibold">Total</td>
              <td className={cx('py-2 text-center font-display text-3xl font-semibold tnum', vencedor === 'a' && 'text-good')}>{totalA}</td>
              <td className={cx('py-2 text-center font-display text-3xl font-semibold tnum', vencedor === 'b' && 'text-good')}>{totalB}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {empate ? (
        <fieldset className="mt-4 rounded-md border border-warn/50 bg-warn-soft p-3">
          <legend className="px-1 text-[13px] font-semibold text-warn">Empate: indique o vencedor e justifique</legend>
          <div className="flex flex-wrap gap-4">
            {[['a', A], ['b', B]].map(([k, e]) => (
              <label key={k} className="flex items-center gap-2"><input type="radio" name="emp" checked={vencedorEmpate === k} onChange={() => setVencedorEmpate(k)} className="h-4 w-4" />{e.nome}</label>
            ))}
          </div>
        </fieldset>
      ) : (
        <p className="mt-4 rounded-md bg-good-soft px-3 py-2 font-semibold text-good">Vencedor pelo placar: {vencedor === 'a' ? A.nome : B.nome}</p>
      )}
      <label htmlFor="obs-duelo" className="mt-3 block text-[13px] font-semibold">Observações{empate && ' (obrigatório no empate)'}</label>
      <textarea id="obs-duelo" rows={2} className={cx(inputCls, 'mt-1 h-auto py-2')} value={obs} onChange={(e) => setObs(e.target.value)} placeholder="Ex.: balão traseiro de Os Estourados caiu no 2º round" />
      <Button size="lg" icon={Send} className="mt-4 w-full" disabled={!pronto} onClick={enviar}>Enviar para homologação</Button>
    </Card>
  )
}

export default function Juiz() {
  const { state } = useApp()
  const [sel, setSel] = useState('estoura-balao')
  const [aberto, setAberto] = useState(null)
  const cat = state.categorias.find((c) => c.id === sel)
  const chave = cat.formato === 'duelos' ? montarChave(state, sel) : null

  if (aberto) {
    return aberto.tipo === 'duelo'
      ? <div className="mx-auto max-w-2xl"><FormDuelo cat={cat} partida={aberto.partida} equipes={state.equipes} onDone={() => setAberto(null)} /></div>
      : <div className="mx-auto max-w-2xl"><FormBanca cat={cat} equipe={aberto.equipe} onDone={() => setAberto(null)} /></div>
  }

  const avDe = (eid) => state.avaliacoes.filter((a) => a.equipeId === eid && !a.partidaId).at(-1)

  return (
    <div>
      <PageHeader eyebrow={`${USERS.juiz.nome} · juiz voluntário`} title="Painel do juiz">
        Lance as notas da arena nas categorias do seu convite. Você não homologa os próprios lançamentos: a coordenação revisa antes de publicar.
      </PageHeader>
      <div className="mb-4 flex gap-1 overflow-x-auto rounded-lg border border-line bg-surface p-1">
        {state.categorias.filter((c) => USERS.juiz.categorias.includes(c.id)).map((c) => (
          <button key={c.id} onClick={() => setSel(c.id)} aria-pressed={c.id === sel}
            className={cx('shrink-0 rounded-md px-3 py-1.5 text-[13.5px] font-medium', c.id === sel ? 'bg-primary-soft font-semibold text-primary' : 'text-muted hover:bg-sunken hover:text-ink')}>{c.nome}</button>
        ))}
      </div>

      {cat.formato === 'duelos' ? (
        !chave ? (
          <Card><Empty icon={GitFork} title="Chave ainda não sorteada">A coordenação precisa sortear a chave do {cat.nome} antes dos duelos.</Empty></Card>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {chave.fases.flat().map((p) => {
              const A = state.equipes.find((e) => e.id === p.a), B = state.equipes.find((e) => e.id === p.b)
              const jogavel = p.a && p.b && (p.status === 'a-jogar' || p.status === 'devolvido')
              const Tag = jogavel ? 'button' : 'div'
              return (
                <Tag key={p.id} onClick={jogavel ? () => setAberto({ tipo: 'duelo', partida: p }) : undefined}
                  className={cx('flex items-center gap-3 rounded-lg border bg-surface p-4 text-left', jogavel ? 'border-primary/40 hover:border-primary' : 'border-line opacity-80')}>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-semibold uppercase tracking-wide text-muted">{p.nomeFase} · jogo {p.idx + 1}</p>
                    <p className="truncate font-semibold">{A?.nome || 'A definir'} × {B?.nome || 'A definir'}</p>
                    <div className="mt-1">
                      {p.status === 'aguardando' && <span className="text-[12.5px] text-muted">Aguardando vencedores anteriores</span>}
                      {p.status === 'a-jogar' && <span className="text-[12.5px] font-semibold text-primary">Pronto para lançar</span>}
                      {['pendente', 'homologado', 'devolvido'].includes(p.status) && <StatusPill status={p.status} versao={p.avaliacao?.versao} />}
                    </div>
                    {p.status === 'devolvido' && <p className="mt-1 text-[12.5px] text-crit">Motivo: {p.avaliacao?.motivoDevolucao}</p>}
                  </div>
                  {jogavel && <ChevronRight size={20} className="text-primary" aria-hidden="true" />}
                </Tag>
              )
            })}
          </div>
        )
      ) : (
        <Card className="overflow-hidden">
          <ul className="divide-y divide-line">
            {state.equipes.filter((e) => e.categoriaId === sel).map((e) => {
              const av = avDe(e.id)
              const pode = !av || av.status === 'devolvido'
              return (
                <li key={e.id}>
                  <button disabled={!pode} onClick={() => setAberto({ tipo: 'banca', equipe: e })}
                    className={cx('flex w-full items-center gap-3 px-4 py-3 text-left', pode ? 'hover:bg-sunken' : 'cursor-default')}>
                    <Gavel size={18} className={pode ? 'text-primary' : 'text-muted'} aria-hidden="true" />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">{e.nome}</p>
                      <p className="text-[12.5px] text-muted">{state.escolas.find((s) => s.id === e.escolaId)?.nome}{av && ` · lançado por ${av.juiz}`}</p>
                      {av?.status === 'devolvido' && <p className="text-[12.5px] text-crit">Devolvido: {av.motivoDevolucao}</p>}
                    </div>
                    {av ? <StatusPill status={av.status} versao={av.versao} short /> : <span className="text-[12.5px] font-semibold text-primary">Avaliar</span>}
                    {pode && <ChevronRight size={18} className="text-primary" aria-hidden="true" />}
                  </button>
                </li>
              )
            })}
          </ul>
        </Card>
      )}
    </div>
  )
}
