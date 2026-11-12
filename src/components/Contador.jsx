import React, { useEffect, useState } from 'react'
import { Timer, PlayCircle } from 'lucide-react'
import { cx } from './ui.jsx'

const mmss = (ms) => {
  const s = Math.max(0, Math.ceil(ms / 1000))
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

/** Contagem regressiva até o início da próxima categoria da agenda do evento. */
export default function Contador({ agenda, categorias, big = false }) {
  const [agora, setAgora] = useState(Date.now())
  useEffect(() => { const t = setInterval(() => setAgora(Date.now()), 1000); return () => clearInterval(t) }, [])
  const nome = (id) => categorias.find((c) => c.id === id)?.nome
  const idx = agenda.findIndex((a) => a.inicio > agora)
  const atual = idx === -1 ? agenda.at(-1) : agenda[idx - 1]
  const prox = idx === -1 ? null : agenda[idx]
  const restante = prox ? prox.inicio - agora : 0
  const total = prox && atual ? prox.inicio - atual.inicio : 1
  const pct = prox ? Math.min(100, Math.max(0, 100 - (restante / total) * 100)) : 100
  const urgente = prox && restante <= 60000
  const hora = (t) => new Date(t).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

  return (
    <section aria-label="Agenda das categorias" className={cx('grid gap-4 rounded-lg border bg-surface sm:grid-cols-[1fr_auto] sm:items-center', urgente ? 'border-warn' : 'border-line', big ? 'p-6' : 'p-4')}>
      <div className="min-w-0">
        <p className={cx('flex items-center gap-1.5 font-semibold text-good', big ? 'text-[18px]' : 'text-[13px]')}><PlayCircle size={big ? 20 : 15} aria-hidden="true" />Em disputa agora: {atual ? nome(atual.categoriaId) : '—'}</p>
        <p className={cx('mt-1 font-display font-semibold leading-tight', big ? 'text-[34px]' : 'text-[22px]')}>
          {prox ? <>Próxima categoria: {nome(prox.categoriaId)}</> : 'Última categoria do dia'}
        </p>
        {prox && <p className={cx('text-muted', big ? 'text-[17px]' : 'text-[13px]')}>Início previsto às {hora(prox.inicio)}</p>}
        <div className={cx('mt-3 overflow-hidden rounded-full bg-sunken', big ? 'h-3' : 'h-2')} role="progressbar" aria-label="Tempo decorrido até a próxima categoria" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
          <div className={cx('h-full rounded-full transition-[width] duration-1000', urgente ? 'bg-warn' : 'bg-primary')} style={{ width: `${pct}%` }} />
        </div>
      </div>
      {prox && (
        <div className={cx('flex items-center gap-3 rounded-lg sm:justify-end', urgente ? 'bg-warn-soft text-warn' : 'bg-primary-soft text-primary', big ? 'px-6 py-4' : 'px-4 py-2.5')} role="timer" aria-label={`Faltam ${mmss(restante)} para ${nome(prox.categoriaId)}`}>
          <Timer size={big ? 34 : 22} aria-hidden="true" />
          <div>
            <p className={cx('font-semibold uppercase tracking-wide', big ? 'text-[14px]' : 'text-[11px]')}>Começa em</p>
            <p className={cx('font-display font-semibold leading-none tnum', big ? 'text-[64px]' : 'text-[36px]')}>{mmss(restante)}</p>
          </div>
        </div>
      )}
    </section>
  )
}
