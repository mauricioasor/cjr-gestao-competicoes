import React, { useState } from 'react'
import { Shuffle, Dices, Lock, Info } from 'lucide-react'
import { useApp } from '../App.jsx'
import { Button, Card, Field, PageHeader, cx, fmtHora, inputCls } from '../components/ui.jsx'
import Bracket from '../components/Bracket.jsx'
import { montarChave } from '../state/store.js'
import { FORMATOS } from '../data/seed.js'

export default function Chaveamento() {
  const { state, dispatch, notify } = useApp()
  const [sel, setSel] = useState('estoura-balao')
  const [semente, setSemente] = useState(() => 1000 + Math.floor(Math.random() * 9000))
  const cat = state.categorias.find((c) => c.id === sel)
  const ch = state.chaves[sel]
  const chave = cat.formato === 'duelos' ? montarChave(state, sel) : null
  const iniciou = state.avaliacoes.some((a) => a.categoriaId === sel && (a.partidaId || cat.formato !== 'duelos'))
  const equipes = state.equipes.filter((e) => e.categoriaId === sel)

  const sortear = () => {
    dispatch({ type: 'DRAW', categoriaId: sel, semente: Number(semente) })
    notify(cat.formato === 'duelos' ? `Chave do ${cat.nome} sorteada (semente ${semente})` : `Ordem de apresentação de ${cat.nome} sorteada`)
  }

  return (
    <div>
      <PageHeader eyebrow="Disputas" title="Chaveamento e partidas">
        O sorteio usa uma semente registrada na auditoria. Com a mesma semente, qualquer pessoa reproduz o mesmo resultado.
      </PageHeader>

      <div className="mb-4 flex gap-1 overflow-x-auto rounded-lg border border-line bg-surface p-1">
        {state.categorias.map((c) => (
          <button key={c.id} onClick={() => setSel(c.id)} aria-pressed={c.id === sel}
            className={cx('shrink-0 rounded-md px-3 py-1.5 text-[13.5px] font-medium', c.id === sel ? 'bg-primary-soft font-semibold text-primary' : 'text-muted hover:bg-sunken hover:text-ink')}>
            {c.nome}
          </button>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_300px]">
        <Card className="min-w-0 p-5">
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-display text-xl font-semibold">{cat.formato === 'duelos' ? 'Chave eliminatória' : 'Ordem de apresentação'}</h2>
            <span className="text-[13px] text-muted">{FORMATOS[cat.formato]} · {equipes.length} equipes</span>
          </div>

          {!ch && (
            <div className="rounded-md border border-dashed border-line p-6 text-center">
              <Dices size={28} className="mx-auto text-muted" aria-hidden="true" />
              <p className="mt-2 font-semibold">{cat.formato === 'duelos' ? 'Chave ainda não sorteada' : 'Ordem ainda não sorteada'}</p>
              <p className="mx-auto mt-1 max-w-[46ch] text-muted">Equipes inscritas: {equipes.map((e) => e.nome).join(', ')}.</p>
            </div>
          )}
          {ch && chave && <Bracket chave={chave} equipes={state.equipes} />}
          {ch && !chave && (
            <ol className="grid gap-2 sm:grid-cols-2">
              {ch.ordem.map((id, i) => (
                <li key={id} className="flex items-center gap-3 rounded-md border border-line px-3 py-2">
                  <span className="w-12 font-mono text-[12.5px] text-muted">{String(9 + Math.floor((i * 15) / 60)).padStart(2, '0')}:{String((i * 15) % 60).padStart(2, '0')}</span>
                  <span className="font-semibold">{state.equipes.find((e) => e.id === id)?.nome}</span>
                </li>
              ))}
            </ol>
          )}
        </Card>

        <Card className="h-fit p-5">
          <h3 className="font-display text-lg font-semibold">Sorteio</h3>
          {ch ? (
            <dl className="mt-3 flex flex-col gap-2 text-[13.5px]">
              <div className="flex justify-between gap-2"><dt className="text-muted">Semente</dt><dd className="font-mono font-semibold">{ch.semente}</dd></div>
              <div className="flex justify-between gap-2"><dt className="text-muted">Sorteado por</dt><dd className="font-semibold">{ch.sorteadoPor}</dd></div>
              <div className="flex justify-between gap-2"><dt className="text-muted">Horário</dt><dd className="font-semibold">{fmtHora(ch.em)}</dd></div>
              <p className="mt-2 flex items-start gap-1.5 rounded-md bg-sunken px-3 py-2 text-[12.5px] text-muted"><Lock size={14} className="mt-0.5 shrink-0" />Sorteio registrado. Um novo sorteio só é possível antes da primeira avaliação.</p>
            </dl>
          ) : null}
          <div className="mt-4 flex flex-col gap-3">
            <Field label="Semente do sorteio" id="semente" hint="Pode ser o número anunciado em voz alta no evento.">
              <input id="semente" type="number" className={cx(inputCls, 'font-mono')} value={semente} onChange={(e) => setSemente(e.target.value)} disabled={iniciou && !!ch} />
            </Field>
            <Button icon={Shuffle} onClick={sortear} disabled={!semente || (iniciou && !!ch)}>{ch ? 'Sortear novamente' : cat.formato === 'duelos' ? 'Sortear chave' : 'Sortear ordem'}</Button>
          </div>
          <p className="mt-4 flex items-start gap-1.5 text-[12.5px] text-muted"><Info size={14} className="mt-0.5 shrink-0" />O sorteio é feito pela coordenação, não pelo juiz, para separar quem organiza de quem pontua.</p>
        </Card>
      </div>
    </div>
  )
}
