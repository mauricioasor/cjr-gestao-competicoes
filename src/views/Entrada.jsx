import React, { useState } from 'react'
import { Mail, ArrowLeft, Link2, ShieldCheck, Trophy, KeyRound, CheckCircle2, School, Lock, LogIn, XCircle } from 'lucide-react'
import { useApp } from '../App.jsx'
import { Button, cx } from '../components/ui.jsx'
import Preferencias from '../components/Preferencias.jsx'
import { USERS } from '../data/seed.js'

const CONTAS = ['coord', 'juiz']
const INEP = { [USERS.prof.inep]: USERS.prof }
const mascarar = (email) => email.replace(/^(.)(.*)(@.*)$/, (_, a, b, c) => `${a}${'•'.repeat(Math.min(b.length, 6))}${c}`)

// Entrada sem senha: o link de acesso chega por e-mail (simulado no protótipo).
export default function Entrada() {
  const { dispatch, prefs, setPrefs } = useApp()
  const [aba, setAba] = useState('escola')
  const [sel, setSel] = useState('coord')
  const [enviado, setEnviado] = useState(false)
  const [codigo, setCodigo] = useState(USERS.prof.inep)
  const [email, setEmail] = useState(USERS.prof.email)
  const [senha, setSenha] = useState('demonstracao')
  const u = USERS[sel]
  const escola = INEP[codigo.trim()]
  const erroEscola = codigo.trim() && !escola ? 'Código não encontrado na lista oficial da rede' : escola && email.trim().toLowerCase() !== escola.email ? 'Este e-mail não é o institucional da direção desta escola' : null

  return (
    <div className="grid min-h-screen bg-bg lg:grid-cols-[1fr_minmax(0,560px)]">
      <aside className="flex flex-col justify-between gap-10 bg-[#142033] py-6 text-[#F4F6FA] lg:py-16" style={{ paddingLeft: 'max(24px, env(safe-area-inset-left, 0px))', paddingRight: 'max(24px, env(safe-area-inset-right, 0px))' }}>
        <div className="mx-auto w-full max-w-[560px]">
          <div className="flex items-center gap-3">
            <svg width="40" height="40" viewBox="0 0 32 32" aria-hidden="true"><path d="M16 2.5 28 9.25v13.5L16 29.5 4 22.75V9.25z" fill="#194E91" /><path d="M16 9.5 22 13v6l-6 3.5-6-3.5v-6z" fill="none" stroke="#F4F6FA" strokeWidth="2" /><circle cx="16" cy="16" r="2" fill="#F4F6FA" /></svg>
            <p className="font-display text-xl font-semibold">CJR · Gestão das Competições</p>
          </div>
          <h1 className="mt-4 font-display text-[28px] font-semibold leading-[1.05] sm:mt-10 sm:text-[52px]">7º Campeonato Joinvilense de Robótica</h1>
          <p className="mt-4 hidden max-w-[46ch] text-[16px] leading-relaxed text-[#C9D6E8] sm:block">Cada escola entra com o próprio login, criado pela Secretaria a partir da lista oficial. A escola só enxerga as próprias equipes, e o juiz só as categorias que avalia.</p>
        </div>
        <ul className="mx-auto hidden w-full max-w-[560px] gap-3 text-[14px] text-[#DCE6F4] sm:grid">
          <li className="flex items-start gap-2"><KeyRound size={18} className="mt-0.5 shrink-0 text-[#8FB4E6]" />Sem cadastro aberto: a direção ativa a conta pelo convite no e-mail institucional.</li>
          <li className="flex items-start gap-2"><ShieldCheck size={18} className="mt-0.5 shrink-0 text-[#8FB4E6]" />O acesso expira ao fim da edição e pode ser revogado a qualquer momento.</li>
          <li className="flex items-start gap-2"><CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#8FB4E6]" />Cada entrada e cada ação ficam registradas com o nome da pessoa.</li>
        </ul>
      </aside>

      <main className="flex items-center py-6 sm:py-10" style={{ paddingLeft: 'max(16px, env(safe-area-inset-left, 0px))', paddingRight: 'max(16px, env(safe-area-inset-right, 0px))' }}>
        <div className="mx-auto w-full max-w-[460px]">
          <div className="mb-6 flex justify-end"><Preferencias prefs={prefs} setPrefs={setPrefs} /></div>
          <p className="mb-1 inline-block rounded bg-warn-soft px-2 py-0.5 text-[11.5px] font-semibold text-warn">Protótipo · contas fictícias</p>
          <h2 className="font-display text-[30px] font-semibold">Entrar</h2>

          <div role="tablist" aria-label="Tipo de acesso" className="mt-4 grid grid-cols-2 gap-1 rounded-lg border border-line bg-sunken p-1">
            {[['escola', School, 'Escola'], ['equipe', KeyRound, 'Secretaria e juízes']].map(([k, I, t]) => (
              <button key={k} role="tab" aria-selected={aba === k} onClick={() => { setAba(k); setEnviado(false) }}
                className={cx('flex min-h-11 items-center justify-center gap-1.5 rounded-md px-2 text-[14px] font-semibold', aba === k ? 'bg-surface text-primary shadow-sm' : 'text-muted hover:text-ink')}><I size={16} aria-hidden="true" />{t}</button>
            ))}
          </div>

          {aba === 'escola' ? (
            <form className="mt-5 rounded-lg border border-line bg-surface p-5" onSubmit={(e) => { e.preventDefault(); if (!erroEscola && escola && senha) dispatch({ type: 'LOGIN', role: 'prof' }) }}>
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-lg bg-primary-soft text-primary"><School size={22} aria-hidden="true" /></span>
                <div>
                  <p className="text-[11.5px] font-semibold uppercase tracking-[0.08em] text-muted">Área da escola</p>
                  <p className="font-display text-[22px] font-semibold leading-tight">Entrar com o login da escola</p>
                </div>
              </div>
              <label htmlFor="inep" className="mt-5 block text-[13px] font-semibold">Código da escola (INEP)</label>
              <input id="inep" className="mt-1 h-11 w-full rounded-md border border-line bg-surface px-3 text-sm text-ink" value={codigo} onChange={(e) => setCodigo(e.target.value)} inputMode="numeric" autoComplete="username" />
              <label htmlFor="email-escola" className="mt-4 block text-[13px] font-semibold">E-mail institucional da direção</label>
              <div className="relative mt-1">
                <Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
                <input id="email-escola" type="email" className="h-11 w-full rounded-md border border-line bg-surface pl-9 pr-3 text-sm text-ink" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <label htmlFor="senha" className="mt-4 block text-[13px] font-semibold">Senha</label>
              <div className="relative mt-1">
                <Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
                <input id="senha" type="password" className="h-11 w-full rounded-md border border-line bg-surface pl-9 pr-3 text-sm text-ink" value={senha} onChange={(e) => setSenha(e.target.value)} autoComplete="current-password" />
              </div>
              {erroEscola && <p className="mt-3 flex items-center gap-1.5 text-[13px] font-medium text-crit" role="alert"><XCircle size={15} />{erroEscola}</p>}
              <Button size="lg" type="submit" className="mt-5 w-full" icon={LogIn} disabled={!!erroEscola || !escola || !senha}>{escola ? `Entrar como ${escola.nome}` : 'Entrar'}</Button>
              <p className="mt-3 text-[12.5px] text-muted">Primeiro acesso? A Secretaria cria a conta a partir da lista oficial e a direção ativa pelo convite no e-mail institucional.</p>
            </form>
          ) : !enviado ? (
            <>
              <p className="mt-4 text-muted">Coordenação e juízes entram pelo convite da edição. Escolha uma conta de demonstração.</p>
              <div role="radiogroup" aria-label="Conta" className="mt-3 flex flex-col gap-2">
                {CONTAS.map((k) => {
                  const c = USERS[k]
                  return (
                    <button key={k} role="radio" aria-checked={sel === k} onClick={() => setSel(k)}
                      className={cx('rounded-lg border bg-surface px-4 py-3 text-left transition', sel === k ? 'border-primary ring-2 ring-primary/25' : 'border-line hover:border-primary/50')}>
                      <p className="font-semibold">{c.nome} <span className="font-normal text-muted">· {c.papel}</span></p>
                      <p className="mt-0.5 text-[12.5px] text-muted">Escopo: {c.escopo}</p>
                    </button>
                  )
                })}
              </div>
              <label htmlFor="email-login" className="mt-5 block text-[13px] font-semibold">E-mail convidado</label>
              <div className="relative mt-1">
                <Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
                <input id="email-login" readOnly value={u.email} className="h-11 w-full rounded-md border border-line bg-sunken pl-9 pr-3 text-sm text-ink" />
              </div>
              <Button size="lg" className="mt-4 w-full" icon={Link2} onClick={() => setEnviado(true)}>Enviar link de acesso</Button>
            </>
          ) : (
            <div className="mt-4 rounded-lg border border-line bg-surface p-5">
              <p className="flex items-center gap-2 font-semibold text-good"><CheckCircle2 size={18} />Link enviado</p>
              <p className="mt-2 text-[14px] text-muted">Enviamos um link de uso único para <strong className="text-ink">{mascarar(u.email)}</strong>. Ele vale por 15 minutos.</p>
              <Button size="lg" className="mt-4 w-full" icon={Link2} onClick={() => dispatch({ type: 'LOGIN', role: sel })}>Abrir link de acesso (simulação)</Button>
              <button onClick={() => setEnviado(false)} className="mt-3 flex items-center gap-1 text-[13px] font-semibold text-primary"><ArrowLeft size={14} />Escolher outra conta</button>
            </div>
          )}

          <div className="mt-8 border-t border-line pt-5">
            <button onClick={() => dispatch({ type: 'LOGIN', role: 'publico' })} className="flex items-center gap-2 text-[14px] font-semibold text-primary hover:underline">
              <Trophy size={16} />Ver o placar público sem entrar
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
