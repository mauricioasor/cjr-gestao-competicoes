import React, { useState } from 'react'
import { ArrowRight, ArrowDownLeft, ArrowUpRight, ChevronDown, Database, Radio } from 'lucide-react'
import { useApp } from '../App.jsx'
import { Card, PageHeader, Tag, cx, fmtData } from '../components/ui.jsx'

const ENDPOINTS = [
  ['GET', '/v1/categorias?edicao={id}', 'Categorias, subcategorias e versão de regras vigente', 'Desafios 01 e 03'],
  ['GET', '/v1/equipes?edicao={id}', 'Equipes inscritas com escola e categoria (sem dados de alunos)', 'Desafios 01 e 03'],
  ['GET', '/v1/resultados?edicao={id}', 'Somente resultados homologados, com versão', 'Desafio 03'],
  ['POST', '/v1/avaliacoes', 'Juiz lança nota (Idempotency-Key)', 'Uso interno'],
  ['POST', '/v1/avaliacoes/{id}/homologacao', 'Coordenação homologa ou devolve', 'Uso interno'],
  ['POST', '/v1/resultados/{id}/correcoes', 'Correção com motivo obrigatório (nova versão)', 'Uso interno'],
]

function Box({ title, sub, strong }) {
  return (
    <div className={cx('min-w-0 flex-1 rounded-md border px-3 py-2.5', strong ? 'border-primary bg-primary-soft' : 'border-line bg-surface')}>
      <p className={cx('font-semibold', strong && 'text-primary')}>{title}</p>
      <p className="text-[12.5px] text-muted">{sub}</p>
    </div>
  )
}

function Evento({ e, aberto, onToggle }) {
  const saida = e.direcao === 'saida'
  return (
    <li className="border-t border-line first:border-t-0">
      <button onClick={onToggle} aria-expanded={aberto} className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-sunken">
        {saida ? <ArrowUpRight size={18} className="shrink-0 text-good" aria-label="Enviado" /> : <ArrowDownLeft size={18} className="shrink-0 text-info" aria-label="Recebido" />}
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[13.5px] font-medium">{e.tipo}</p>
          <p className="text-[12.5px] text-muted">{saida ? `Para ${e.destino}` : `De ${e.origem}`} · {fmtData(e.em)}</p>
        </div>
        <Tag tone="primary">{e.status}</Tag>
        <ChevronDown size={16} className={cx('shrink-0 text-muted transition', aberto && 'rotate-180')} aria-hidden="true" />
      </button>
      {aberto && <pre className="mx-4 mb-3 overflow-x-auto rounded-md bg-sunken p-3 font-mono text-[12px] leading-relaxed">{JSON.stringify(e.payload, null, 2)}</pre>}
    </li>
  )
}

export default function Integracoes() {
  const { state } = useApp()
  const [aberto, setAberto] = useState(state.eventos[0]?.id)
  return (
    <div>
      <PageHeader eyebrow="Interoperabilidade" title="Integração com os outros módulos">
        Cada domínio é dono do seu dado. Consumimos edição e escolas da Gestão do Evento e publicamos resultados homologados para o Histórico Público.
      </PageHeader>

      <Card className="mb-5 p-4">
        <div className="flex flex-col items-stretch gap-2 md:flex-row md:items-center">
          <Box title="Desafio 01 · Gestão do Evento" sub="Dono de edição, escolas e calendário" />
          <ArrowRight className="mx-auto shrink-0 rotate-90 text-muted md:rotate-0" size={20} aria-hidden="true" />
          <Box strong title="Desafio 02 · Competições" sub="Dono de regras, inscrições, disputas e resultados" />
          <ArrowRight className="mx-auto shrink-0 rotate-90 text-muted md:rotate-0" size={20} aria-hidden="true" />
          <Box title="Desafio 03 · Histórico Público" sub="Dono da memória pública do campeonato" />
        </div>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <Card className="min-w-0 overflow-hidden">
          <h2 className="flex items-center gap-2 border-b border-line px-4 py-3 font-display text-lg font-semibold"><Radio size={18} />Eventos trocados <span className="text-[13px] font-normal text-muted">({state.eventos.length})</span></h2>
          <ul>{state.eventos.map((e) => <Evento key={e.id} e={e} aberto={aberto === e.id} onToggle={() => setAberto(aberto === e.id ? null : e.id)} />)}</ul>
          <p className="border-t border-line px-4 py-2.5 text-[12.5px] text-muted">Homologue ou corrija um resultado para ver o evento sair em tempo real.</p>
        </Card>

        <div className="flex min-w-0 flex-col gap-5">
          <Card className="p-4">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold"><Database size={18} />Dados consumidos do Desafio 01</h2>
            <dl className="mt-3 grid gap-2 text-[13.5px] sm:grid-cols-2">
              <div className="rounded-md bg-sunken px-3 py-2"><dt className="text-[12px] text-muted">Edição</dt><dd className="font-mono font-semibold">{state.edicao.id}</dd></div>
              <div className="rounded-md bg-sunken px-3 py-2"><dt className="text-[12px] text-muted">Escolas (cache só leitura)</dt><dd className="font-semibold tnum">{state.escolas.length}</dd></div>
              <div className="rounded-md bg-sunken px-3 py-2 sm:col-span-2"><dt className="text-[12px] text-muted">Tema</dt><dd className="font-semibold">{state.edicao.tema}</dd></div>
            </dl>
          </Card>
          <Card className="min-w-0 overflow-hidden">
            <h2 className="border-b border-line px-4 py-3 font-display text-lg font-semibold">API publicada (OpenAPI /v1)</h2>
            <ul className="divide-y divide-line">
              {ENDPOINTS.map(([m, p, d, quem]) => (
                <li key={p} className="px-4 py-2.5">
                  <p className="flex flex-wrap items-center gap-2"><span className={cx('rounded px-1.5 font-mono text-[11.5px] font-bold', m === 'GET' ? 'bg-info-soft text-info' : 'bg-good-soft text-good')}>{m}</span><code className="break-all font-mono text-[12.5px]">{p}</code></p>
                  <p className="mt-0.5 text-[12.5px] text-muted">{d} · {quem}</p>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}
