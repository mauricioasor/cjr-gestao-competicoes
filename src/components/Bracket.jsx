import React from 'react'
import { Trophy, Clock3 } from 'lucide-react'
import { cx } from './ui.jsx'

function Slot({ equipe, placar, venceu, perdeu, mostraPlacar, big }) {
  return (
    <div className={cx('flex items-center gap-2 px-3', big ? 'py-2.5' : 'py-2', venceu && 'bg-good-soft')}>
      <span className={cx('min-w-0 flex-1 truncate', big ? 'text-[17px]' : 'text-[13.5px]', venceu ? 'font-bold text-ink' : perdeu ? 'text-muted' : 'font-medium', !equipe && 'italic text-muted')}>
        {equipe ? equipe.nome : 'A definir'}
      </span>
      {venceu && <Trophy size={big ? 17 : 14} className="shrink-0 text-good" aria-label="Vencedor" />}
      {mostraPlacar && placar != null && <span className={cx('font-display font-semibold tnum', big ? 'text-xl' : 'text-[15px]', venceu ? 'text-good' : 'text-muted')}>{placar}</span>}
    </div>
  )
}

/** Chave eliminatória. `publico`: esconde placares não homologados (RN02). */
export default function Bracket({ chave, equipes, publico = false, big = false, onOpen }) {
  const eqp = (id) => equipes.find((e) => e.id === id)
  return (
    <div className="overflow-x-auto pb-2">
      <div className="grid min-w-[720px] grid-cols-3 gap-6">
        {chave.fases.map((partidas, f) => (
          <div key={f} className="flex flex-col">
            <p className={cx('mb-3 font-semibold uppercase tracking-[0.08em] text-muted', big ? 'text-[13px]' : 'text-[11.5px]')}>{partidas[0].nomeFase}</p>
            <div className="flex flex-1 flex-col justify-around gap-3">
              {partidas.map((p) => {
                const av = p.avaliacao
                const homol = p.status === 'homologado'
                const mostra = av && (!publico || homol)
                const clickable = onOpen && p.a && p.b
                const Tag = clickable ? 'button' : 'div'
                return (
                  <Tag key={p.id} onClick={clickable ? () => onOpen(p) : undefined}
                    className={cx('w-full overflow-hidden rounded-md border bg-surface text-left', homol ? 'border-good/50' : 'border-line', clickable && 'transition hover:border-primary')}>
                    <Slot equipe={eqp(p.a)} placar={av?.totalA} mostraPlacar={mostra} venceu={homol && p.vencedor === p.a} perdeu={homol && p.vencedor !== p.a} big={big} />
                    <div className="border-t border-line" />
                    <Slot equipe={eqp(p.b)} placar={av?.totalB} mostraPlacar={mostra} venceu={homol && p.vencedor === p.b} perdeu={homol && p.vencedor !== p.b} big={big} />
                    {p.status === 'pendente' && (
                      <p className="flex items-center gap-1 border-t border-line bg-warn-soft px-3 py-1 text-[11.5px] font-semibold text-warn"><Clock3 size={12} />Aguardando homologação</p>
                    )}
                  </Tag>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
