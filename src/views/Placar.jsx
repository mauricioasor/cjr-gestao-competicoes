import React, { useEffect, useState } from 'react'
import { Monitor, X, BadgeCheck, Clock3, Medal, Trophy, Play, Pause } from 'lucide-react'
import { useApp } from '../App.jsx'
import { Button, Card, Empty, PageHeader, StatusPill, cx, fmtHora } from '../components/ui.jsx'
import Bracket from '../components/Bracket.jsx'
import Contador from '../components/Contador.jsx'
import { montarChave, ranking } from '../state/store.js'

const MEDAL = ['text-[#B8860B]', 'text-[#8A939E]', 'text-[#A0612B]']

function Ranking({ state, cat, big }) {
  const linhas = ranking(state, cat.id)
  const recente = state.ultimoPlacar && Date.now() - state.ultimoPlacar.em < 8000 ? state.ultimoPlacar.id : null
  if (!linhas.length) return <Empty icon={Clock3} title="Nenhum resultado oficial ainda">Os resultados aparecem aqui assim que forem homologados.</Empty>
  return (
    <div className="overflow-x-auto">
      <table className={cx('w-full text-left', big ? 'min-w-[640px] text-[20px]' : 'text-[15px] sm:min-w-[560px]')}>
        <thead className={cx('uppercase tracking-wide text-muted', big ? 'text-[13px]' : 'text-[11.5px]')}>
          <tr><th className="w-16 px-4 py-2 font-semibold">Pos.</th><th className="px-3 py-2 font-semibold">Equipe</th><th className="hidden px-3 py-2 font-semibold sm:table-cell">Escola</th><th className="px-4 py-2 text-right font-semibold">Pontos</th></tr>
        </thead>
        <tbody>
          {linhas.map((l) => (
            <tr key={l.id + l.versao} className={cx('border-t border-line', l.id === recente && 'flash')}>
              <td className="px-4 py-3">
                <span className="flex items-center gap-1.5 font-display font-semibold tnum">
                  {l.posicao <= 3 && <Medal size={big ? 22 : 17} className={MEDAL[l.posicao - 1]} aria-hidden="true" />}{l.posicao}º
                </span>
              </td>
              <td className="px-3 py-3">
                <span className="font-semibold">{l.equipe?.nome}</span>
                {l.versao > 1 && <span className="ml-2 align-middle"><StatusPill status="homologado" versao={l.versao} /></span>}
                <span className="block text-[13px] text-muted sm:hidden">{state.escolas.find((e) => e.id === l.equipe?.escolaId)?.nome}</span>
              </td>
              <td className="hidden px-3 py-3 text-muted sm:table-cell">{state.escolas.find((e) => e.id === l.equipe?.escolaId)?.nome}</td>
              <td className={cx('px-4 py-3 text-right font-display font-semibold tnum', big ? 'text-[30px]' : 'text-[20px]')}>{l.total.toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Conteudo({ state, cat, big }) {
  if (cat.formato === 'duelos') {
    const chave = montarChave(state, cat.id)
    if (!chave) return <Empty icon={Clock3} title="Chave ainda não sorteada">Os duelos aparecem aqui após o sorteio.</Empty>
    const campeao = chave.fases[2][0].vencedor
    return (
      <div>
        {campeao && (
          <p className="mb-4 flex items-center gap-2 rounded-md bg-good-soft px-4 py-3 font-display text-xl font-semibold text-good"><Trophy size={22} />Campeã: {state.equipes.find((e) => e.id === campeao)?.nome}</p>
        )}
        <Bracket chave={chave} equipes={state.equipes} publico big={big} />
      </div>
    )
  }
  return <Ranking state={state} cat={cat} big={big} />
}

export default function Placar() {
  const { state } = useApp()
  const [sel, setSel] = useState('robotica-lego')
  const [telao, setTelao] = useState(false)
  const [rodar, setRodar] = useState(false)
  const [agora, setAgora] = useState(Date.now())
  const cat = state.categorias.find((c) => c.id === sel)
  const pendCat = state.avaliacoes.filter((a) => a.categoriaId === sel && a.status === 'pendente').length
  const ultima = state.avaliacoes.filter((a) => a.status === 'homologado').map((a) => a.homologadoEm).sort().at(-1)

  useEffect(() => { const t = setInterval(() => setAgora(Date.now()), 2000); return () => clearInterval(t) }, [])
  useEffect(() => {
    if (!telao || !rodar) return
    const t = setInterval(() => setSel((s) => { const i = state.categorias.findIndex((c) => c.id === s); return state.categorias[(i + 1) % state.categorias.length].id }), 8000)
    return () => clearInterval(t)
  }, [telao, rodar, state.categorias])
  useEffect(() => {
    if (!telao) return
    const k = (e) => e.key === 'Escape' && setTelao(false)
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [telao])

  const Tabs = ({ big }) => (
    <div className="flex gap-1 overflow-x-auto rounded-lg border border-line bg-surface p-1">
      {state.categorias.map((c) => (
        <button key={c.id} onClick={() => setSel(c.id)} aria-pressed={c.id === sel}
          className={cx('shrink-0 rounded-md px-3 font-medium', big ? 'py-2 text-[16px]' : 'py-1.5 text-[13.5px]', c.id === sel ? 'bg-primary font-semibold text-primary-ink' : 'text-muted hover:bg-sunken hover:text-ink')}>{c.nome}</button>
      ))}
    </div>
  )

  const Selo = () => (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px]">
      <span className="flex items-center gap-1.5 font-semibold text-good"><BadgeCheck size={16} />Resultado oficial · somente homologados</span>
      {ultima && <span className="text-muted">Última homologação às {fmtHora(ultima)}</span>}
      {pendCat > 0 && <span className="flex items-center gap-1 text-warn"><Clock3 size={14} />{pendCat} resultado(s) em homologação nesta categoria</span>}
    </div>
  )

  if (telao) {
    return (
      <div className="fixed inset-0 z-40 overflow-auto bg-bg" style={{ paddingTop: 'env(safe-area-inset-top, 0px)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }} data-agora={agora}>
        <div className="mx-auto flex max-w-[1400px] flex-col gap-5 py-6" style={{ paddingLeft: 'max(24px, env(safe-area-inset-left, 0px))', paddingRight: 'max(24px, env(safe-area-inset-right, 0px))' }}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[14px] font-semibold uppercase tracking-[0.1em] text-muted">{state.edicao.nome}</p>
              <h1 className="font-display text-[44px] font-semibold leading-none sm:text-[56px]">{cat.nome}</h1>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" icon={rodar ? Pause : Play} onClick={() => setRodar(!rodar)}>{rodar ? 'Pausar rotação' : 'Girar categorias'}</Button>
              <Button variant="secondary" icon={X} onClick={() => setTelao(false)}>Sair do telão</Button>
            </div>
          </div>
          <Contador agenda={state.agenda} categorias={state.categorias} big />
          <Tabs big />
          <Selo />
          <Card className="p-2 sm:p-4"><Conteudo state={state} cat={cat} big /></Card>
        </div>
      </div>
    )
  }

  return (
    <div data-agora={agora}>
      <PageHeader eyebrow={`${state.edicao.nome} · acesso público, sem login`} title="Placar e classificação"
        actions={<Button variant="secondary" icon={Monitor} onClick={() => setTelao(true)}>Modo telão</Button>}>
        Mostra equipes e escolas, nunca nomes de estudantes. Os mesmos dados seguem para o Histórico Público.
      </PageHeader>
      <div className="flex flex-col gap-4">
        <Contador agenda={state.agenda} categorias={state.categorias} />
        <Tabs />
        <Selo />
        <Card className="p-2 sm:p-4"><Conteudo state={state} cat={cat} /></Card>
      </div>
    </div>
  )
}
