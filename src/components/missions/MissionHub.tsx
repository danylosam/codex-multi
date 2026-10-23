'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ArrowDownRight, ArrowUpRight, AudioLines, BarChart3, Boxes, Megaphone, PenTool, Sparkles, Target, Workflow } from 'lucide-react'
import { MissionBriefingModal } from './MissionBriefingModal'
import { MissionCard, type Mission } from './MissionCard'

const missions: Mission[] = [
  {
    id: 'vsl', title: 'Estruturação de VSL de Alta Conversão',
    description: 'Desenhe uma narrativa persuasiva, do primeiro gancho à chamada para ação.',
    deliverable: 'roteiro de VSL pronto para produção', agentId: 'vsl-writer', sherpa: 'Sherpa Copywriter', category: 'Copywriting',
    icon: AudioLines, accent: 'bg-indigo-400', example: '“Se você já tentou organizar sua vida financeira, mas todo mês termina sem saber para onde o dinheiro foi, existe uma peça simples que quase ninguém ensina...” Um gancho que parte de uma dor reconhecível e abre espaço para apresentar uma nova abordagem.',
  },
  {
    id: 'creatives', title: 'Esteira de Criativos para Meta Ads',
    description: 'Planeje variações de anúncios com ângulos, ganchos e hipóteses testáveis.',
    deliverable: 'matriz de criativos para seus testes', agentId: 'traffic-analyst', sherpa: 'Sherpa de Tráfego', category: 'Tráfego',
    icon: Megaphone, accent: 'bg-amber-400', example: 'Ângulo: custo da inércia. Gancho: “Quanto custa adiar essa decisão por mais um mês?” Variação visual: comparação entre cenário atual e resultado desejado. Hipótese: testar a urgência racional contra a prova social.',
  },
  {
    id: 'capture-page', title: 'Página de Captura Magnética',
    description: 'Organize promessa, argumento e conversão em uma página focada em leads.',
    deliverable: 'wireframe de copy para a página', agentId: 'funnel-architect', sherpa: 'Sherpa de Funil', category: 'Funil',
    icon: Target, accent: 'bg-emerald-400', example: 'Headline: “Descubra os 3 ajustes que tornam sua rotina comercial previsível”. Subheadline: uma promessa específica para um público definido, seguida de um formulário simples e uma chamada clara para receber o material.',
  },
  {
    id: 'offer', title: 'Oferta Irrecusável',
    description: 'Transforme produto, bônus e garantias em uma proposta de valor coesa.',
    deliverable: 'arquitetura da oferta e ancoragem de valor', agentId: 'funnel-architect', sherpa: 'Sherpa de Funil', category: 'Oferta',
    icon: Boxes, accent: 'bg-fuchsia-400', example: 'Oferta principal: programa para organizar o fluxo comercial em 30 dias. Bônus: roteiro de implementação semanal. Garantia: período de teste com critérios claros. Ancoragem: compare o investimento com o custo de manter o processo atual.',
  },
]

const playbooks = [
  { title: 'Biblioteca de Hooks', category: 'Copywriting', description: 'Aberturas para interromper o scroll e ganhar atenção.', icon: PenTool },
  { title: 'Mapa de Oferta', category: 'Oferta', description: 'Componentes para construir uma proposta de valor clara.', icon: Boxes },
  { title: 'Ângulos de Campanha', category: 'Tráfego', description: 'Hipóteses de comunicação para testar seus anúncios.', icon: BarChart3 },
  { title: 'Jornada de Conversão', category: 'Funil', description: 'Etapas e pontos de contato do primeiro clique à venda.', icon: Workflow },
]

export default function MissionHub() {
  const router = useRouter()
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null)
  const [modalMode, setModalMode] = useState<'briefing' | 'example'>('briefing')

  function openMission(mission: Mission, mode: 'briefing' | 'example') {
    setSelectedMission(mission)
    setModalMode(mode)
  }

  function startMission(mission: Mission, briefing: string) {
    window.sessionStorage.setItem('sherpa-mission-briefing', briefing)
    router.push(`/workspace/${mission.agentId}`)
  }

  return (
    <div className="min-h-full bg-[radial-gradient(ellipse_at_78%_0%,rgba(99,102,241,0.08),transparent_34%),#09090b] px-5 py-8 text-zinc-100 sm:px-8 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-9 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-300/15 bg-indigo-300/[0.06] px-3 py-1.5 text-[11px] font-medium text-indigo-100/80"><Sparkles className="size-3.5" /> Seu espaço de execução</div>
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Hub de Missões</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">Aprenda construindo. Escolha uma missão e avance com um Sherpa ao seu lado, etapa por etapa.</p>
          </div>
          <div className="hidden items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-xs text-zinc-500 sm:flex"><span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.65)]" /> Sherpas disponíveis</div>
        </header>

        <section aria-labelledby="featured-missions" className="mb-11">
          <div className="mb-4 flex items-end justify-between">
            <div><p className="text-[11px] font-semibold tracking-[0.16em] text-zinc-500 uppercase">Comece por aqui</p><h2 id="featured-missions" className="mt-1 text-xl font-semibold tracking-tight">Missões em destaque</h2></div>
            <span className="text-xs text-zinc-600">{missions.length} missões práticas</span>
          </div>
          <div className="grid gap-4 xl:grid-cols-3">
            {missions.map((mission) => <MissionCard key={mission.id} mission={mission} featured onStart={(item) => openMission(item, 'briefing')} onExample={(item) => openMission(item, 'example')} />)}
          </div>
        </section>

        <section aria-labelledby="playbooks-heading">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div><p className="text-[11px] font-semibold tracking-[0.16em] text-zinc-500 uppercase">Ferramentas de execução</p><h2 id="playbooks-heading" className="mt-1 text-xl font-semibold tracking-tight">Esteira de Ativos / Playbooks</h2></div>
            <button type="button" onClick={() => openMission(missions[0], 'briefing')} className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 transition hover:text-white">Explorar playbooks <ArrowUpRight className="size-3.5" /></button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {playbooks.map((playbook) => {
              const Icon = playbook.icon
              return <button key={playbook.title} type="button" onClick={() => openMission(missions.find((mission) => mission.category === playbook.category) ?? missions[0], 'briefing')} className="group rounded-2xl border border-zinc-800/80 bg-zinc-900/35 p-4 text-left transition hover:border-zinc-700 hover:bg-zinc-900/75">
                <div className="flex items-center justify-between"><span className="flex size-9 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-300 transition group-hover:border-zinc-700 group-hover:text-white"><Icon className="size-4" /></span><span className="rounded-full border border-white/[0.06] bg-white/[0.03] px-2 py-1 text-[10px] text-zinc-500">{playbook.category}</span></div>
                <p className="mt-4 text-sm font-medium text-zinc-200">{playbook.title}</p><p className="mt-1.5 text-xs leading-5 text-zinc-500">{playbook.description}</p><span className="mt-4 inline-flex items-center gap-1 text-[11px] font-medium text-zinc-500 transition group-hover:text-zinc-200">Abrir playbook <ArrowDownRight className="size-3" /></span>
              </button>
            })}
          </div>
        </section>
      </div>

      {selectedMission && <MissionBriefingModal key={`${selectedMission.id}-${modalMode}`} mission={selectedMission} initialMode={modalMode} onClose={() => setSelectedMission(null)} onStart={startMission} />}
    </div>
  )
}
