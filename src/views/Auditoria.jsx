import React, { useState } from 'react'
import { Lock, ArrowRight } from 'lucide-react'
import { useApp } from '../App.jsx'
import { Card, PageHeader, cx, fmtData } from '../components/ui.jsx'

export default function Auditoria() {
  const { state } = useApp()
  const tipos = ['Todas', ...new Set(state.auditoria.map((a) => a.entidade))]
  const [f, setF] = useState('Todas')
  const lista = state.auditoria.filter((a) => f === 'Todas' || a.entidade === f)
  return (
    <div>
      <PageHeader eyebrow="Rastreabilidade" title="Trilha de auditoria">
        Cada inscrição, sorteio, nota, homologação e correção fica registrada com autor, horário e motivo.
      </PageHeader>
      <p className="mb-4 flex items-center gap-1.5 text-[13px] text-muted"><Lock size={14} />Registro somente de inclusão: nada aqui pode ser editado ou apagado.</p>
      <div className="mb-3 flex flex-wrap gap-1.5" role="group" aria-label="Filtrar por tipo">
        {tipos.map((t) => (
          <button key={t} onClick={() => setF(t)} aria-pressed={f === t}
            className={cx('rounded-full border px-3 py-1 text-[13px] font-medium', f === t ? 'border-primary bg-primary-soft text-primary' : 'border-line bg-surface text-muted hover:text-ink')}>{t}</button>
        ))}
      </div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-[13.5px]">
            <thead className="bg-sunken text-[12px] uppercase tracking-wide text-muted">
              <tr><th className="px-4 py-2 font-semibold">Quando</th><th className="px-3 py-2 font-semibold">Quem</th><th className="px-3 py-2 font-semibold">Ação</th><th className="px-3 py-2 font-semibold">Detalhe</th><th className="px-4 py-2 font-semibold">Antes → depois</th></tr>
            </thead>
            <tbody>
              {lista.map((a) => (
                <tr key={a.id} className="border-t border-line align-top">
                  <td className="whitespace-nowrap px-4 py-2.5 font-mono text-[12.5px] text-muted">{fmtData(a.em)}</td>
                  <td className="px-3 py-2.5">{a.ator}</td>
                  <td className="px-3 py-2.5"><span className="font-semibold">{a.acao}</span>{a.ref && <span className="block text-[12.5px] text-muted">{a.entidade} · {a.ref}</span>}</td>
                  <td className="px-3 py-2.5 text-muted">{a.detalhe}</td>
                  <td className="px-4 py-2.5">
                    {a.antes ? (
                      <span className="flex flex-wrap items-center gap-1.5 text-[12.5px]">
                        <span className="rounded bg-crit-soft px-1.5 py-0.5 text-crit line-through">{a.antes}</span>
                        <ArrowRight size={13} className="text-muted" aria-label="para" />
                        <span className="rounded bg-good-soft px-1.5 py-0.5 font-semibold text-good">{a.depois}</span>
                      </span>
                    ) : <span className="text-muted">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
