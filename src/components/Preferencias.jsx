import React from 'react'
import { Sun, Moon, Type } from 'lucide-react'
import { cx } from './ui.jsx'

const KEY = 'cjr-preferencias'
export function carregarPrefs() {
  try { return { tema: 'claro', grande: false, ...JSON.parse(localStorage.getItem(KEY) || '{}') } } catch { return { tema: 'claro', grande: false } }
}
export function aplicarPrefs(p) {
  const root = document.documentElement
  root.dataset.theme = p.tema === 'escuro' ? 'dark' : 'light'
  root.style.zoom = p.grande ? '1.15' : ''
  try { localStorage.setItem(KEY, JSON.stringify(p)) } catch { /* armazenamento indisponível: segue só na sessão */ }
}

/** Tema claro/escuro e texto grande. Botões com rótulo, 44px de alvo, estado anunciado. */
export default function Preferencias({ prefs, setPrefs, compact = false }) {
  const escuro = prefs.tema === 'escuro'
  const btn = 'flex h-11 min-w-11 items-center justify-center gap-1.5 rounded-md border border-line bg-surface px-2.5 text-[13px] font-semibold text-ink hover:bg-sunken'
  return (
    <div className="flex items-center gap-1.5" role="group" aria-label="Preferências de visualização">
      <button type="button" className={btn} aria-pressed={escuro} onClick={() => setPrefs({ ...prefs, tema: escuro ? 'claro' : 'escuro' })}
        title={escuro ? 'Mudar para tema claro' : 'Mudar para tema escuro'} aria-label={escuro ? 'Tema escuro ativado. Mudar para tema claro' : 'Tema claro ativado. Mudar para tema escuro'}>
        {escuro ? <Moon size={17} aria-hidden="true" /> : <Sun size={17} aria-hidden="true" />}
        {!compact && <span className="hidden md:inline">{escuro ? 'Escuro' : 'Claro'}</span>}
      </button>
      <button type="button" className={cx(btn, prefs.grande && 'border-primary bg-primary-soft text-primary')} aria-pressed={prefs.grande}
        onClick={() => setPrefs({ ...prefs, grande: !prefs.grande })} title="Aumentar o texto" aria-label="Texto grande">
        <Type size={17} aria-hidden="true" />{!compact && <span className="hidden md:inline">A+</span>}
      </button>
    </div>
  )
}
