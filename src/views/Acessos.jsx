import React, { useState } from 'react'
import { Send, UserPlus, Ban, KeyRound, School, Gavel, CheckCircle2, Clock3, MinusCircle } from 'lucide-react'
import { useApp } from '../App.jsx'
import { Button, Card, Field, Modal, PageHeader, Tag, cx, inputCls } from '../components/ui.jsx'
import { USERS } from '../data/seed.js'

const STATUS = {
  aceito: { cls: 'bg-good-soft text-good', Icon: CheckCircle2, txt: 'Ativo' },
  enviado: { cls: 'bg-warn-soft text-warn', Icon: Clock3, txt: 'Convite enviado' },
  'nao-convidado': { cls: 'bg-sunken text-muted', Icon: MinusCircle, txt: 'Não convidada' },
  revogado: { cls: 'bg-crit-soft text-crit', Icon: Ban, txt: 'Revogado' },
}
const ORDEM = { 'nao-convidado': 0, enviado: 1, revogado: 2, aceito: 3 }
function Status({ s }) {
  const p = STATUS[s]
  return <span className={cx('inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[12px] font-semibold', p.cls)}><p.Icon size={13} aria-hidden="true" />{p.txt}</span>
}

function ConviteEscola({ escola, atual, onClose }) {
  const { dispatch, notify } = useApp()
  const [nome, setNome] = useState(atual.responsavel || '')
  const [email, setEmail] = useState(atual.email || '')
  const ok = nome.trim().length > 3 && /.+@.+\..+/.test(email)
  return (
    <Modal title={`Convidar responsável · ${escola.nome}`} onClose={onClose}
      footer={<><Button variant="secondary" onClick={onClose}>Cancelar</Button><Button icon={Send} disabled={!ok} onClick={() => { dispatch({ type: 'INVITE_SCHOOL', escolaId: escola.id, responsavel: nome.trim(), email: email.trim() }); notify(`Convite enviado para ${nome.trim()}`); onClose() }}>Enviar convite</Button></>}>
      <div className="flex flex-col gap-4">
        <Field label="Professor(a) responsável" id="conv-nome"><input id="conv-nome" className={inputCls} value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome completo" /></Field>
        <Field label="E-mail institucional" id="conv-email" hint="O convite cria um acesso individual, válido só para esta escola nesta edição."><input id="conv-email" type="email" className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nome@escola.gov.br" /></Field>
      </div>
    </Modal>
  )
}

function ConviteJuiz({ onClose }) {
  const { state, dispatch, notify } = useApp()
  const [nome, setNome] = useState('Patrícia Gomes')
  const [email, setEmail] = useState('patricia.gomes@example.com')
  const [cats, setCats] = useState(['artbot-junior'])
  const ok = nome.trim().length > 3 && /.+@.+\..+/.test(email) && cats.length > 0
  const toggle = (id) => setCats(cats.includes(id) ? cats.filter((c) => c !== id) : [...cats, id])
  return (
    <Modal title="Convidar juiz" onClose={onClose}
      footer={<><Button variant="secondary" onClick={onClose}>Cancelar</Button><Button icon={Send} disabled={!ok} onClick={() => { dispatch({ type: 'INVITE_JUDGE', nome: nome.trim(), email: email.trim(), categorias: cats }); notify(`Convite de juiz enviado para ${nome.trim()}`); onClose() }}>Enviar convite</Button></>}>
      <div className="flex flex-col gap-4">
        <Field label="Nome" id="juiz-nome"><input id="juiz-nome" className={inputCls} value={nome} onChange={(e) => setNome(e.target.value)} /></Field>
        <Field label="E-mail" id="juiz-email"><input id="juiz-email" type="email" className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
        <fieldset>
          <legend className="text-[13px] font-semibold">Categorias que vai avaliar</legend>
          <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
            {state.categorias.map((c) => (
              <label key={c.id} className="flex items-center gap-2 rounded-md border border-line px-3 py-2 text-[14px]">
                <input type="checkbox" className="h-4 w-4" checked={cats.includes(c.id)} onChange={() => toggle(c.id)} />{c.nome}
              </label>
            ))}
          </div>
          <p className="mt-2 text-[12px] text-muted">O juiz só vê e avalia essas categorias. O acesso expira ao fim do evento.</p>
        </fieldset>
      </div>
    </Modal>
  )
}

export default function Acessos() {
  const { state, dispatch, notify } = useApp()
  const [aba, setAba] = useState('escolas')
  const [convEscola, setConvEscola] = useState(null)
  const [convJuiz, setConvJuiz] = useState(false)
  const { escolas: aEsc, juizes } = state.acessos
  const nEquipes = (id) => state.equipes.filter((e) => e.escolaId === id).length
  const catNome = (id) => state.categorias.find((c) => c.id === id)?.nome
  const ativos = aEsc.filter((a) => a.status === 'aceito').length

  return (
    <div>
      <PageHeader eyebrow={`Edição ${state.edicao.ano} · convites e permissões`} title="Acessos da edição"
        actions={aba === 'juizes' && <Button icon={UserPlus} onClick={() => setConvJuiz(true)}>Convidar juiz</Button>}>
        As escolas vêm cadastradas pela Secretaria. A cada edição, a coordenação convida um responsável por escola e os juízes, cada um com o seu escopo.
      </PageHeader>

      <div className="mb-5 grid gap-3 md:grid-cols-3">
        {[
          [KeyRound, 'Acesso por pessoa, não por escola', 'Cada ação fica registrada com o nome de quem fez.'],
          [School, 'Escopo por escola ou categoria', 'O professor vê só a escola; o juiz, só as suas categorias.'],
          [Clock3, 'Validade por edição', 'O vínculo expira no fim da edição e pode ser revogado antes.'],
        ].map(([I, t, d]) => (
          <div key={t} className="flex gap-3 rounded-lg border border-line bg-surface p-4">
            <I size={20} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
            <div><p className="font-semibold">{t}</p><p className="text-[13px] text-muted">{d}</p></div>
          </div>
        ))}
      </div>

      <div className="mb-3 flex gap-1 rounded-lg border border-line bg-surface p-1 sm:w-fit" role="tablist">
        {[['escolas', School, `Escolas · ${ativos} ativas`], ['juizes', Gavel, `Juízes · ${juizes.length}`], ['coord', KeyRound, 'Coordenação']].map(([k, I, t]) => (
          <button key={k} role="tab" aria-selected={aba === k} onClick={() => setAba(k)}
            className={cx('flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13.5px] font-medium', aba === k ? 'bg-primary-soft font-semibold text-primary' : 'text-muted hover:bg-sunken hover:text-ink')}><I size={15} />{t}</button>
        ))}
      </div>

      {aba === 'escolas' && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-[13.5px]">
              <thead className="bg-sunken text-[12px] uppercase tracking-wide text-muted">
                <tr><th className="px-4 py-2 font-semibold">Escola</th><th className="px-3 py-2 font-semibold">Responsável</th><th className="px-3 py-2 font-semibold">Situação</th><th className="px-3 py-2 text-right font-semibold">Equipes</th><th className="px-4 py-2" /></tr>
              </thead>
              <tbody>
                {[...aEsc].sort((x, y) => ORDEM[x.status] - ORDEM[y.status]).map((a) => {
                  const esc = state.escolas.find((e) => e.id === a.escolaId)
                  return (
                    <tr key={a.escolaId} className="border-t border-line">
                      <td className="px-4 py-2.5 font-semibold">{esc.nome}</td>
                      <td className="px-3 py-2.5">{a.responsavel ? <><p>{a.responsavel}</p><p className="text-[12px] text-muted">{a.email}</p></> : <span className="text-muted">—</span>}</td>
                      <td className="px-3 py-2.5"><Status s={a.status} /></td>
                      <td className="px-3 py-2.5 text-right font-semibold tnum">{nEquipes(a.escolaId)}</td>
                      <td className="px-4 py-2.5 text-right">
                        <div className="flex justify-end gap-1.5">
                          {a.status === 'nao-convidado' || a.status === 'revogado' ? (
                            <Button size="sm" icon={Send} onClick={() => setConvEscola(a)}>Convidar</Button>
                          ) : a.status === 'enviado' ? (
                            <Button size="sm" variant="secondary" icon={Send} onClick={() => notify(`Convite reenviado para ${a.responsavel}`)}>Reenviar</Button>
                          ) : null}
                          {a.status !== 'nao-convidado' && a.status !== 'revogado' && (
                            <Button size="sm" variant="danger" icon={Ban} onClick={() => { dispatch({ type: 'REVOKE', tipo: 'escola', id: a.escolaId }); notify(`Acesso de ${a.responsavel} revogado`) }}>Revogar</Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {aba === 'juizes' && (
        <Card className="overflow-hidden">
          <ul className="divide-y divide-line">
            {juizes.map((j) => (
              <li key={j.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{j.nome} <span className="text-[12.5px] font-normal text-muted">· {j.email}</span></p>
                  <div className="mt-1 flex flex-wrap gap-1">{j.categorias.map((c) => <Tag key={c}>{catNome(c)}</Tag>)}</div>
                </div>
                <Status s={j.status} />
                {j.status !== 'revogado' && <Button size="sm" variant="danger" icon={Ban} onClick={() => { dispatch({ type: 'REVOKE', tipo: 'juiz', id: j.id }); notify(`Acesso de ${j.nome} revogado`) }}>Revogar</Button>}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {aba === 'coord' && (
        <Card className="overflow-hidden">
          <ul className="divide-y divide-line">
            <li className="flex flex-wrap items-center gap-3 px-4 py-3">
              <div className="min-w-0 flex-1"><p className="font-semibold">Super Admin · Secretaria de Educação</p><p className="text-[12.5px] text-muted">Cria as edições e nomeia a coordenação. Acesso permanente.</p></div>
              <Status s="aceito" />
            </li>
            <li className="flex flex-wrap items-center gap-3 px-4 py-3">
              <div className="min-w-0 flex-1"><p className="font-semibold">{USERS.coord.nome} · {USERS.coord.papel}</p><p className="text-[12.5px] text-muted">{USERS.coord.email} · escopo: {USERS.coord.escopo}</p></div>
              <Status s="aceito" />
            </li>
          </ul>
        </Card>
      )}

      <p className="mt-4 text-[12.5px] text-muted">Em produção, o login fica num provedor de identidade comum aos 3 módulos (ex.: Keycloak), e cada módulo controla as próprias permissões.</p>
      {convEscola && <ConviteEscola escola={state.escolas.find((e) => e.id === convEscola.escolaId)} atual={convEscola} onClose={() => setConvEscola(null)} />}
      {convJuiz && <ConviteJuiz onClose={() => setConvJuiz(false)} />}
    </div>
  )
}
