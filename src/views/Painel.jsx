import React from 'react'
import { ShieldCheck, ArrowRight, Users, School, Clock3, BadgeCheck } from 'lucide-react'
import { useApp } from '../App.jsx'
import { Card, PageHeader, Tag, fmtHora } from '../components/ui.jsx'
import { FORMATOS } from '../data/seed.js'
import { montarChave } from '../state/store.js'

export const publicoTxt = (p) => (p.tipo === 'ano' ? `${p.min}º ao ${p.max}º ano` : p.tipo === 'eja' ? 'EJA' : 'Professores e estudantes')

function Kpi({ icon: Icon, label, value, tone = 'ink', onClick, hint }) {
  const toneCls = { ink: 'text-ink', warn: 'text-warn', good: 'text-good' }[tone]
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag onClick={onClick} className="flex flex-col gap-1 rounded-lg border border-line bg-surface p-4 text-left transition enabled:hover:border-primary">
      <span className="flex items-center gap-1.5 text-[12.5px] font-medium text-muted"><Icon size={15} aria-hidden="true" />{label}</span>
      <span className={`font-display text-[34px] font-semibold leading-none tnum ${toneCls}`}>{value}</span>
      {hint && <span className="text-[12px] text-muted">{hint}</span>}
    </Tag>
  )
}

export default function Painel() {
  const { state, go } = useApp()
  const { equipes, avaliacoes, categorias, auditoria } = state
  const escolas = new Set(equipes.map((e) => e.escolaId)).size
  const pend = avaliacoes.filter((a) => a.status === 'pendente').length
  const homol = avaliacoes.filter((a) => a.status === 'homologado').length

  return (
    <div>
      <PageHeader eyebrow={`Edição ${state.edicao.ano} · recebida da Gestão do Evento`} title="Visão geral das competições">
        Acompanhe inscrições, disputas e resultados das 7 categorias. Nada chega ao placar público sem homologação.
      </PageHeader>

      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi icon={Users} label="Equipes inscritas" value={equipes.length} hint="em 7 categorias" />
        <Kpi icon={School} label="Escolas participantes" value={escolas} hint="dados mestres do Desafio 01" />
        <Kpi icon={Clock3} label="Aguardando homologação" value={pend} tone={pend ? 'warn' : 'ink'} onClick={() => go('homologacao')} hint="clique para revisar" />
        <Kpi icon={BadgeCheck} label="Resultados oficiais" value={homol} tone="good" hint="publicados no placar" />
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-3 rounded-lg border border-primary/30 bg-primary-soft px-4 py-3 text-primary">
        <ShieldCheck size={20} aria-hidden="true" className="shrink-0" />
        <p className="min-w-0 flex-1 text-[14px]"><strong>Princípio do módulo:</strong> quem lança a nota não a homologa, e só o resultado homologado é publicado. Toda correção gera nova versão com motivo.</p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
        <Card className="min-w-0 overflow-hidden">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <h2 className="font-display text-lg font-semibold">Andamento por categoria</h2>
            <button onClick={() => go('placar')} className="flex items-center gap-1 text-[13px] font-semibold text-primary hover:underline">Ver placar <ArrowRight size={14} /></button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-[13.5px]">
              <thead className="bg-sunken text-[12px] uppercase tracking-wide text-muted">
                <tr><th className="px-4 py-2 font-semibold">Categoria</th><th className="px-3 py-2 font-semibold">Formato</th><th className="px-3 py-2 font-semibold">Público</th><th className="px-3 py-2 text-right font-semibold">Equipes</th><th className="px-4 py-2 font-semibold">Resultados homologados</th></tr>
              </thead>
              <tbody>
                {categorias.map((c) => {
                  const n = equipes.filter((e) => e.categoriaId === c.id).length
                  let feitos, alvo
                  if (c.formato === 'duelos') {
                    const ch = montarChave(state, c.id)
                    alvo = 7
                    feitos = ch ? ch.fases.flat().filter((p) => p.status === 'homologado').length : 0
                  } else {
                    alvo = n
                    feitos = avaliacoes.filter((a) => a.categoriaId === c.id && a.status === 'homologado').length
                  }
                  const pct = Math.round((feitos / Math.max(alvo, 1)) * 100)
                  return (
                    <tr key={c.id} className="border-t border-line">
                      <td className="px-4 py-3"><p className="font-semibold">{c.nome}</p><p className="text-[12px] text-muted">{c.rotulo} · regras v{c.regraVersao}</p></td>
                      <td className="px-3 py-3"><Tag>{FORMATOS[c.formato]}</Tag></td>
                      <td className="px-3 py-3 text-muted">{publicoTxt(c.publico)}</td>
                      <td className="px-3 py-3 text-right font-semibold tnum">{n}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-sunken" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${c.nome}: ${feitos} de ${alvo}`}>
                            <div className="h-full rounded-full bg-good" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="w-16 text-right text-[12.5px] text-muted tnum">{feitos} de {alvo}</span>
                        </div>
                        {c.formato === 'duelos' && !state.chaves[c.id] && <p className="mt-1 text-[12px] font-medium text-warn">Chave ainda não sorteada</p>}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="min-w-0">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <h2 className="font-display text-lg font-semibold">Últimas ações</h2>
            <button onClick={() => go('auditoria')} className="flex items-center gap-1 text-[13px] font-semibold text-primary hover:underline">Auditoria <ArrowRight size={14} /></button>
          </div>
          <ol className="divide-y divide-line">
            {auditoria.slice(0, 6).map((a) => (
              <li key={a.id} className="px-4 py-2.5">
                <p className="text-[13.5px]"><span className="font-semibold">{a.acao}</span>{a.ref && <span className="text-muted"> · {a.ref}</span>}</p>
                <p className="text-[12px] text-muted">{a.ator} · {fmtHora(a.em)}</p>
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </div>
  )
}
