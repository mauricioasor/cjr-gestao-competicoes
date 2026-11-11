import React, { useState } from 'react'
import { Lock, ShieldAlert, Upload, History, CheckCircle2, AlertTriangle } from 'lucide-react'
import { useApp } from '../App.jsx'
import { Button, Card, Field, PageHeader, Tag, cx, fmtData, inputBase, inputCls } from '../components/ui.jsx'
import { FORMATOS } from '../data/seed.js'
import { publicoTxt } from './Painel.jsx'

function Detalhe({ cat }) {
  const { state, dispatch, notify } = useApp()
  const [pesos, setPesos] = useState(() => Object.fromEntries(cat.subcategorias.map((s) => [s.id, s.peso])))
  const [motivo, setMotivo] = useState('')
  const soma = Object.values(pesos).reduce((s, v) => s + (Number(v) || 0), 0)
  const mudou = cat.subcategorias.some((s) => Number(pesos[s.id]) !== s.peso)
  const historico = state.regrasHistorico.filter((h) => h.categoriaId === cat.id)
  const podePublicar = mudou && soma === 100 && motivo.trim().length >= 5

  const publicar = () => {
    dispatch({ type: 'PUBLISH_RULES', categoriaId: cat.id, motivo: motivo.trim(), subcategorias: cat.subcategorias.map((s) => ({ ...s, peso: Number(pesos[s.id]) })) })
    setMotivo('')
    notify(`Regras v${cat.regraVersao + 1} de ${cat.nome} publicadas e registradas na auditoria`)
  }

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <Card className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">{cat.rotulo}</p>
            <h2 className="font-display text-2xl font-semibold">{cat.nome}</h2>
            <p className="mt-1 text-muted">{cat.descricao}</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-good-soft px-3 py-1 text-[12.5px] font-semibold text-good"><Lock size={13} />Regras v{cat.regraVersao} em vigor</span>
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            ['Formato', FORMATOS[cat.formato], true],
            ['Público', publicoTxt(cat.publico), true],
            ['Integrantes', `${cat.equipe.min} a ${cat.equipe.max}`, cat.equipe.confirmado],
            ['Vistoria de segurança', cat.vistoria ? 'Obrigatória antes da nota' : 'Não se aplica', true],
          ].map(([k, v, ok]) => (
            <div key={k} className="rounded-md bg-sunken px-3 py-2">
              <dt className="text-[12px] text-muted">{k}</dt>
              <dd className="font-semibold">{v}</dd>
              {!ok && <dd className="mt-0.5"><Tag tone="warn">a confirmar no edital</Tag></dd>}
            </div>
          ))}
        </dl>
      </Card>

      {cat.formato === 'duelos' ? (
        <Card className="p-5">
          <h3 className="font-display text-lg font-semibold">Regra do duelo</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-[14px]">
            <li>Arena hexagonal, kit Atto, {cat.rounds} rounds por duelo.</li>
            <li>Vence quem estourar mais balões somando os {cat.rounds} rounds.</li>
            <li>Chave eliminatória: quartas, semifinal e final, com sorteio de semente registrada.</li>
          </ul>
          <p className="mt-3 flex items-center gap-1.5 text-[13px] font-medium text-warn"><AlertTriangle size={15} />Regra de desempate a confirmar no edital. Hoje o juiz indica o vencedor e justifica.</p>
        </Card>
      ) : (
        <Card className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-display text-lg font-semibold">Subcategorias e pesos</h3>
            {!cat.pesosConfirmados && <Tag tone="warn">Pesos fictícios · confirmar no edital</Tag>}
          </div>
          <p className="mt-1 text-[13px] text-muted">O juiz dá nota de 0 a 10 em cada subcategoria. O total vai de 0 a 100 conforme os pesos. Todas são obrigatórias para a equipe entrar no ranking.</p>
          <div className="mt-4 flex flex-col gap-2">
            {cat.subcategorias.map((s) => (
              <div key={s.id} className="flex items-center gap-3">
                <label htmlFor={`peso-${cat.id}-${s.id}`} className="min-w-0 flex-1 font-medium">{s.nome}</label>
                <input id={`peso-${cat.id}-${s.id}`} type="number" min="0" max="100" step="5" value={pesos[s.id]}
                  onChange={(e) => setPesos({ ...pesos, [s.id]: e.target.value })}
                  className={cx(inputBase, 'w-24 text-right tnum')} />
                <span className="w-4 text-muted">%</span>
              </div>
            ))}
            <div className="mt-1 flex items-center justify-end gap-2 border-t border-line pt-2 text-[14px]">
              <span className="text-muted">Soma</span>
              <span className={cx('font-bold tnum', soma === 100 ? 'text-good' : 'text-crit')}>{soma}%</span>
              {soma === 100 ? <CheckCircle2 size={16} className="text-good" aria-label="Soma correta" /> : <span className="text-[12.5px] font-medium text-crit">precisa somar 100%</span>}
            </div>
          </div>

          <div className="mt-5 grid gap-3 rounded-md border border-dashed border-line p-4 md:grid-cols-[1fr_auto] md:items-end">
            <Field label="Motivo da nova versão" id={`motivo-${cat.id}`} hint="Fica registrado na auditoria. Avaliações já lançadas mantêm a versão com que foram feitas.">
              <input id={`motivo-${cat.id}`} className={inputCls} value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Ex.: ajuste aprovado na reunião de juízes" />
            </Field>
            <Button icon={Upload} disabled={!podePublicar} onClick={publicar}>Publicar versão {cat.regraVersao + 1}</Button>
          </div>
        </Card>
      )}

      <Card className="p-5">
        <h3 className="flex items-center gap-2 font-display text-lg font-semibold"><History size={18} />Histórico de versões</h3>
        <ol className="mt-3 flex flex-col gap-2">
          {historico.map((h) => (
            <li key={h.versao} className="rounded-md border border-line px-3 py-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded bg-primary-soft px-1.5 font-mono text-[12px] font-semibold text-primary">v{h.versao}</span>
                <span className="font-semibold">{h.motivo}</span>
                <span className="ml-auto text-[12px] text-muted">{h.autor} · {fmtData(h.em)}</span>
              </div>
              {h.subcategorias.length > 0 && <p className="mt-1 text-[12.5px] text-muted">{h.subcategorias.map((s) => `${s.nome} ${s.peso}%`).join(' · ')}</p>}
            </li>
          ))}
        </ol>
      </Card>
    </div>
  )
}

export default function Configuracao() {
  const { state } = useApp()
  const [sel, setSel] = useState('robotica-lego')
  const cat = state.categorias.find((c) => c.id === sel)
  return (
    <div>
      <PageHeader eyebrow="Regras por edição e categoria" title="Configuração da competição">
        Cada mudança de regra gera uma nova versão com autor, data e motivo, e o histórico entre edições fica preservado.
      </PageHeader>
      <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
        <Card className="h-fit overflow-hidden p-1.5">
          <ul className="flex gap-1 overflow-x-auto lg:flex-col">
            {state.categorias.map((c) => (
              <li key={c.id} className="shrink-0">
                <button onClick={() => setSel(c.id)} aria-current={c.id === sel ? 'true' : undefined}
                  className={cx('flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-[14px]', c.id === sel ? 'bg-primary-soft font-semibold text-primary' : 'hover:bg-sunken')}>
                  <span className="whitespace-nowrap">{c.nome}</span>
                  <span className="font-mono text-[11.5px] text-muted">v{c.regraVersao}</span>
                </button>
              </li>
            ))}
          </ul>
        </Card>
        <Detalhe key={sel + cat.regraVersao} cat={cat} />
      </div>
      <p className="mt-4 flex items-center gap-1.5 text-[12.5px] text-muted"><ShieldAlert size={14} />Só a coordenação altera regras. Juízes e professores apenas consultam a versão vigente.</p>
    </div>
  )
}
