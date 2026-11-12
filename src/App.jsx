import React, { createContext, useContext, useEffect, useReducer, useState, useCallback } from 'react'
import {
  LayoutDashboard, SlidersHorizontal, Users, GitFork, Gavel, ShieldCheck, ScrollText, Webhook, Trophy, RotateCcw, CheckCircle2, KeyRound, LogOut, LogIn,
} from 'lucide-react'
import { initialState, reducer } from './state/store.js'
import { USERS } from './data/seed.js'
import { cx } from './components/ui.jsx'
import Painel from './views/Painel.jsx'
import Configuracao from './views/Configuracao.jsx'
import Inscricoes from './views/Inscricoes.jsx'
import Chaveamento from './views/Chaveamento.jsx'
import Juiz from './views/Juiz.jsx'
import Homologacao from './views/Homologacao.jsx'
import Auditoria from './views/Auditoria.jsx'
import Integracoes from './views/Integracoes.jsx'
import Placar from './views/Placar.jsx'
import Entrada from './views/Entrada.jsx'
import Acessos from './views/Acessos.jsx'
import Preferencias, { aplicarPrefs, carregarPrefs } from './components/Preferencias.jsx'

const Ctx = createContext(null)
export const useApp = () => useContext(Ctx)

const VIEWS = {
  painel: { label: 'Visão geral', icon: LayoutDashboard, C: Painel },
  config: { label: 'Configuração', icon: SlidersHorizontal, C: Configuracao },
  acessos: { label: 'Acessos', icon: KeyRound, C: Acessos },
  inscricoes: { label: 'Inscrições', icon: Users, C: Inscricoes },
  chaveamento: { label: 'Chaveamento', icon: GitFork, C: Chaveamento },
  juiz: { label: 'Painel do juiz', icon: Gavel, C: Juiz },
  homologacao: { label: 'Homologação', icon: ShieldCheck, C: Homologacao },
  auditoria: { label: 'Auditoria', icon: ScrollText, C: Auditoria },
  integracoes: { label: 'Integrações', icon: Webhook, C: Integracoes },
  placar: { label: 'Placar público', icon: Trophy, C: Placar },
}
const NAV = {
  coord: ['painel', 'config', 'acessos', 'inscricoes', 'chaveamento', 'homologacao', 'auditoria', 'integracoes', 'placar'],
  juiz: ['juiz', 'placar'],
  prof: ['inscricoes', 'placar'],
  publico: ['placar'],
}

function Logo() {
  return (
    <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
      <path d="M16 2.5 28 9.25v13.5L16 29.5 4 22.75V9.25z" fill="rgb(var(--primary))" />
      <path d="M16 9.5 22 13v6l-6 3.5-6-3.5v-6z" fill="none" stroke="rgb(var(--primary-ink))" strokeWidth="2" />
      <circle cx="16" cy="16" r="2" fill="rgb(var(--primary-ink))" />
    </svg>
  )
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState)
  const [view, setView] = useState('painel')
  const [toast, setToast] = useState(null)
  const [prefs, setPrefs] = useState(carregarPrefs)
  useEffect(() => { aplicarPrefs(prefs) }, [prefs])

  const notify = useCallback((msg) => {
    setToast({ msg, k: Date.now() })
  }, [])
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3200)
    return () => clearTimeout(t)
  }, [toast])

  useEffect(() => { if (state.role) setView(NAV[state.role][0]) }, [state.role])

  if (!state.role) {
    return <Ctx.Provider value={{ state, dispatch, notify, go: setView, prefs, setPrefs }}><Entrada /></Ctx.Provider>
  }
  const nav = NAV[state.role]
  const current = nav.includes(view) ? view : nav[0]
  const View = VIEWS[current].C
  const pendentes = state.avaliacoes.filter((a) => a.status === 'pendente').length
  const user = USERS[state.role]

  return (
    <Ctx.Provider value={{ state, dispatch, notify, go: setView, prefs, setPrefs }}>
      <div className="min-h-screen bg-bg">
        <a href="#conteudo" className="sr-only z-50 rounded bg-primary px-4 py-2 font-semibold text-primary-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Pular para o conteúdo</a>
        <header className="sticky top-0 z-30 border-b border-line bg-surface/95 backdrop-blur" style={{ top: 'env(safe-area-inset-top, 0px)' }}>
          <div className="mx-auto flex max-w-[1320px] flex-wrap items-center gap-x-4 gap-y-2 py-2.5" style={{ paddingLeft: 'max(16px, env(safe-area-inset-left, 0px))', paddingRight: 'max(16px, env(safe-area-inset-right, 0px))' }}>
            <div className="flex min-w-0 items-center gap-2.5">
              <Logo />
              <div className="min-w-0 leading-tight">
                <p className="truncate font-display text-[17px] font-semibold">CJR · Gestão das Competições</p>
                <p className="hidden truncate text-[12px] text-muted sm:block">{state.edicao.nome} · Secretaria de Educação de Joinville</p>
              </div>
            </div>
            <span className="hidden rounded bg-warn-soft px-2 py-0.5 text-[11.5px] font-semibold text-warn 2xl:inline">Protótipo · dados fictícios</span>
            <div className="ml-auto flex items-center gap-2">
              <div className="hidden text-right leading-tight xl:block">
                <p className="text-[13px] font-semibold">{user.nome}</p>
                <p className="text-[11.5px] text-muted">{user.escopo || user.papel}</p>
              </div>
              <Preferencias prefs={prefs} setPrefs={setPrefs} />
              <button onClick={() => dispatch({ type: 'LOGOUT' })} aria-label={state.role === 'publico' ? 'Entrar' : 'Trocar de conta'} className="flex h-11 items-center gap-1.5 rounded-md border border-line bg-surface px-2.5 text-[13px] font-semibold text-ink hover:bg-sunken">
                {state.role === 'publico' ? <><LogIn size={17} /><span className="hidden sm:inline">Entrar</span></> : <><LogOut size={17} /><span className="hidden sm:inline">Trocar de conta</span></>}
              </button>
              <button onClick={() => { dispatch({ type: 'RESET' }); notify('Demo reiniciada com os dados iniciais') }} className="grid h-11 w-11 place-items-center rounded-md text-muted hover:bg-sunken hover:text-ink" title="Reiniciar demo" aria-label="Reiniciar demo">
                <RotateCcw size={17} />
              </button>
            </div>
          </div>
        </header>

        <div className="mx-auto flex max-w-[1320px] flex-col gap-5 py-5 lg:flex-row" style={{ paddingLeft: 'max(16px, env(safe-area-inset-left, 0px))', paddingRight: 'max(16px, env(safe-area-inset-right, 0px))' }}>
          <nav aria-label="Seções" className="lg:sticky lg:top-[76px] lg:w-56 lg:shrink-0 lg:self-start">
            <div className="mb-3 hidden rounded-lg border border-line bg-surface p-3 lg:block">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">Conectado como</p>
              <p className="mt-1 font-semibold">{user.nome}</p>
              <p className="text-[12.5px] text-muted">{user.papel}</p>
              {user.escopo && <p className="mt-2 rounded bg-sunken px-2 py-1 text-[12px] text-muted">Escopo: {user.escopo}</p>}
            </div>
            <ul className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 lg:flex-col lg:overflow-visible">
              {nav.map((k) => {
                const V = VIEWS[k]
                const active = k === current
                return (
                  <li key={k} className="shrink-0">
                    <button onClick={() => setView(k)} aria-current={active ? 'page' : undefined}
                      className={cx('flex min-h-11 w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-[15px] font-medium transition',
                        active ? 'bg-primary-soft text-primary' : 'text-ink hover:bg-sunken')}>
                      <V.icon size={17} aria-hidden="true" />
                      <span className="whitespace-nowrap">{V.label}</span>
                      {k === 'homologacao' && pendentes > 0 && (
                        <span className="ml-auto rounded-full bg-warn px-1.5 text-[11.5px] font-bold text-surface tnum" aria-label={`${pendentes} pendentes`}>{pendentes}</span>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>
          <main id="conteudo" tabIndex={-1} className="min-w-0 flex-1 focus:outline-none" key={current + state.role}>
            <View />
          </main>
        </div>

        {toast && (
          <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4" style={{ marginBottom: 'env(safe-area-inset-bottom, 0px)' }}>
            <div key={toast.k} className="toast flex max-w-[560px] items-center gap-2 rounded-lg bg-ink px-4 py-3 text-[14px] font-medium text-bg shadow-xl" role="status">
              <CheckCircle2 size={18} className="shrink-0" aria-hidden="true" /> {toast.msg}
            </div>
          </div>
        )}
      </div>
    </Ctx.Provider>
  )
}
