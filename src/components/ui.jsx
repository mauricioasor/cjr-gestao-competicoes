import React, { useEffect } from 'react'
import { BadgeCheck, Clock3, Undo2, History, X, Info } from 'lucide-react'

export const cx = (...c) => c.filter(Boolean).join(' ')

export function Button({ variant = 'primary', size = 'md', className, icon: Icon, children, ...p }) {
  const v = {
    primary: 'bg-primary text-primary-ink hover:brightness-110 disabled:opacity-40',
    secondary: 'bg-surface text-ink border border-line hover:bg-sunken disabled:opacity-40',
    ghost: 'text-ink hover:bg-sunken disabled:opacity-40',
    danger: 'bg-surface text-crit border border-crit/40 hover:bg-crit-soft disabled:opacity-40',
    good: 'bg-good text-surface hover:brightness-110 disabled:opacity-40',
  }[variant]
  const s = { sm: 'h-8 px-3 text-[13px] gap-1.5', md: 'h-10 px-4 text-sm gap-2', lg: 'h-12 px-5 text-base gap-2' }[size]
  return (
    <button className={cx('inline-flex items-center justify-center rounded-md font-semibold transition disabled:cursor-not-allowed', v, s, className)} {...p}>
      {Icon && <Icon size={size === 'sm' ? 15 : 17} aria-hidden="true" />}
      {children}
    </button>
  )
}

export function Card({ className, children, ...p }) {
  return <section className={cx('rounded-lg border border-line bg-surface', className)} {...p}>{children}</section>
}

export function PageHeader({ eyebrow, title, children, actions }) {
  return (
    <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        {eyebrow && <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">{eyebrow}</p>}
        <h1 className="font-display text-[28px] font-semibold leading-tight text-ink">{title}</h1>
        {children && <p className="mt-1 max-w-[68ch] text-muted">{children}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </header>
  )
}

const PILL = {
  pendente: { cls: 'bg-warn-soft text-warn', Icon: Clock3, txt: 'Aguardando homologação' },
  homologado: { cls: 'bg-good-soft text-good', Icon: BadgeCheck, txt: 'Homologado' },
  devolvido: { cls: 'bg-crit-soft text-crit', Icon: Undo2, txt: 'Devolvido ao juiz' },
  corrigido: { cls: 'bg-info-soft text-info', Icon: History, txt: 'Corrigido' },
}
export function StatusPill({ status, versao, short }) {
  const key = status === 'homologado' && versao > 1 ? 'corrigido' : status
  const p = PILL[key] || { cls: 'bg-sunken text-muted', Icon: Info, txt: status }
  return (
    <span className={cx('inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[12px] font-semibold', p.cls)}>
      <p.Icon size={13} aria-hidden="true" />
      {short && key === 'pendente' ? 'Aguardando' : p.txt}
      {key === 'corrigido' && ` · v${versao}`}
    </span>
  )
}

export function Tag({ children, tone = 'neutral' }) {
  const t = { neutral: 'bg-sunken text-muted', primary: 'bg-primary-soft text-primary', warn: 'bg-warn-soft text-warn' }[tone]
  return <span className={cx('inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11.5px] font-semibold', t)}>{children}</span>
}

export function Field({ label, id, hint, error, children }) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <label htmlFor={id} className="text-[13px] font-semibold text-ink">{label}</label>
      {children}
      {hint && !error && <p className="text-[12px] text-muted">{hint}</p>}
      {error && <p className="text-[12px] font-medium text-crit" role="alert">{error}</p>}
    </div>
  )
}
export const inputBase = 'h-10 rounded-md border border-line bg-surface px-3 text-sm text-ink placeholder:text-muted/70 focus:border-primary'
export const inputCls = `${inputBase} w-full`

export function Modal({ title, onClose, children, footer }) {
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [onClose])
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="max-h-[92vh] w-full max-w-xl overflow-auto rounded-t-xl bg-surface shadow-2xl sm:rounded-xl">
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <h2 className="font-display text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="rounded p-1 text-muted hover:bg-sunken" aria-label="Fechar"><X size={18} /></button>
        </div>
        <div className="px-5 py-4">{children}</div>
        {footer && <div className="flex flex-wrap justify-end gap-2 border-t border-line px-5 py-3">{footer}</div>}
      </div>
    </div>
  )
}

export function Empty({ icon: Icon = Info, title, children }) {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
      <Icon size={28} className="text-muted" aria-hidden="true" />
      <p className="font-semibold">{title}</p>
      {children && <p className="max-w-[48ch] text-muted">{children}</p>}
    </div>
  )
}

export const fmtHora = (iso) => new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
export const fmtData = (iso) => new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
