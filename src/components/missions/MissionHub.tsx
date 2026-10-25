'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AudioLines, BarChart3, Boxes, ChevronLeft, ChevronRight, CirclePlus, Megaphone, PenTool, Search, Sparkles, Target, Workflow } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Separator } from '@/components/ui/separator'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { cn } from 'cn'
import { MissionBriefingModal } from './MissionBriefingModal'
import { MissionCard, type Mission } from './MissionCard'

const missions: Mission[] = [
  {
    id: 'vsl', title: 'Estruturação de VSL de Alta Conversão',
    description: 'Desenhe uma narrativa persuasiva, do primeiro gancho à chamada para ação.',
    deliverable: 'roteiro de VSL pronto para produção', agentId: 'vsl-writer', sherpa: 'Sherpa Copywriter', category: 'Copywriting',
    icon: AudioLines, example: '“Se você já tentou organizar sua vida financeira, mas todo mês termina sem saber para onde o dinheiro foi, existe uma peça simples que quase ninguém ensina...” Um gancho que parte de uma dor reconhecível e abre espaço para apresentar uma nova abordagem.',
  },
  {
    id: 'creatives', title: 'Esteira de Criativos para Meta Ads',
    description: 'Planeje variações de anúncios com ângulos, ganchos e hipóteses testáveis.',
    deliverable: 'matriz de criativos para seus testes', agentId: 'traffic-analyst', sherpa: 'Sherpa de Tráfego', category: 'Tráfego',
    icon: Megaphone, example: 'Ângulo: custo da inércia. Gancho: “Quanto custa adiar essa decisão por mais um mês?” Variação visual: comparação entre cenário atual e resultado desejado. Hipótese: testar a urgência racional contra a prova social.',
  },
  {
    id: 'capture-page', title: 'Página de Captura Magnética',
    description: 'Organize promessa, argumento e conversão em uma página focada em leads.',
    deliverable: 'wireframe de copy para a página', agentId: 'funnel-architect', sherpa: 'Sherpa de Funil', category: 'Funil',
    icon: Target, example: 'Headline: “Descubra os 3 ajustes que tornam sua rotina comercial previsível”. Subheadline: uma promessa específica para um público definido, seguida de um formulário simples e uma chamada clara para receber o material.',
  },
  {
    id: 'offer', title: 'Oferta Irrecusável',
    description: 'Transforme produto, bônus e garantias em uma proposta de valor coesa.',
    deliverable: 'arquitetura da oferta e ancoragem de valor', agentId: 'funnel-architect', sherpa: 'Sherpa de Funil', category: 'Oferta',
    icon: Boxes, example: 'Oferta principal: programa para organizar o fluxo comercial em 30 dias. Bônus: roteiro de implementação semanal. Garantia: período de teste com critérios claros. Ancoragem: compare o investimento com o custo de manter o processo atual.',
  },
]

const playbooks = [
  { title: 'Biblioteca de Hooks', category: 'Copywriting', description: 'Aberturas para interromper o scroll e ganhar atenção.', icon: PenTool },
  { title: 'Mapa de Oferta', category: 'Oferta', description: 'Componentes para construir uma proposta de valor clara.', icon: Boxes },
  { title: 'Ângulos de Campanha', category: 'Tráfego', description: 'Hipóteses de comunicação para testar seus anúncios.', icon: BarChart3 },
  { title: 'Jornada de Conversão', category: 'Funil', description: 'Etapas e pontos de contato do primeiro clique à venda.', icon: Workflow },
  { title: 'Briefing de Avatar', category: 'Copywriting', description: 'Organize desejos, objeções e linguagem do público.', icon: Target },
  { title: 'Plano de Testes', category: 'Tráfego', description: 'Priorize criativos, métricas e próximos experimentos.', icon: CirclePlus },
]

const categories = ['Todas as missões', 'Copywriting', 'Tráfego', 'Oferta', 'Funil'] as const
type CategoryFilter = (typeof categories)[number]

export default function MissionHub() {
  const router = useRouter()
  const featuredRow = useRef<HTMLDivElement>(null)
  const playbookRow = useRef<HTMLDivElement>(null)
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null)
  const [modalMode, setModalMode] = useState<'briefing' | 'example'>('briefing')
  const [category, setCategory] = useState<CategoryFilter>('Todas as missões')
  const [search, setSearch] = useState('')

  const visibleMissions = missions.filter((mission) => {
    const matchesCategory = category === 'Todas as missões' || mission.category === category
    const matchesSearch = `${mission.title} ${mission.description} ${mission.sherpa}`.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  function openMission(mission: Mission, mode: 'briefing' | 'example') {
    setSelectedMission(mission)
    setModalMode(mode)
  }

  function startMission(mission: Mission, briefing: string) {
    window.sessionStorage.setItem('sherpa-mission-briefing', briefing)
    router.push(`/workspace/${mission.agentId}`)
  }

  function scrollRow(row: React.RefObject<HTMLDivElement | null>, direction: -1 | 1) {
    row.current?.scrollBy({ left: direction * 360, behavior: 'smooth' })
  }

  return (
    <div className="flex min-h-full bg-background text-foreground">
      <aside className="hidden w-[250px] shrink-0 flex-col border-r border-border bg-card px-5 py-7 lg:flex">
        <div className="flex items-center gap-3 pb-6">
          <span className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground"><Megaphone /></span>
          <div><p className="text-sm font-semibold">Marketing</p><p className="mt-0.5 text-[11px] text-muted-foreground">Hub de execução</p></div>
        </div>
        <Separator />

        <InputGroup className="mt-6 h-10 rounded-xl bg-input/20">
          <InputGroupInput value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar missão" aria-label="Buscar missão" className="text-xs" />
          <InputGroupAddon><Search /></InputGroupAddon>
        </InputGroup>

        <div className="mt-7">
          <p className="mb-3 px-2 text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">Explorar por área</p>
          <ToggleGroup multiple={false} orientation="vertical" spacing={1} value={[category]} onValueChange={(values) => { if (values[0]) setCategory(values[0] as CategoryFilter) }} aria-label="Filtrar missões por área" className="w-full items-stretch">
            {categories.map((item) => {
              const count = item === 'Todas as missões' ? missions.length : missions.filter((mission) => mission.category === item).length
              return <ToggleGroupItem key={item} value={item} variant="default" className="h-10 w-full justify-between rounded-lg px-3 text-xs text-muted-foreground aria-pressed:bg-secondary aria-pressed:text-secondary-foreground">
                <span>{item}</span><Badge variant="secondary" className="h-5 px-1.5 text-[10px]">{count}</Badge>
              </ToggleGroupItem>
            })}
          </ToggleGroup>
        </div>

        <Separator className="my-6" />
        <div>
          <div className="mb-3 flex items-center justify-between px-2"><p className="text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">Acesso rápido</p><Search className="size-4 text-muted-foreground" /></div>
          {missions.slice(0, 2).map((mission) => <Button key={mission.id} type="button" variant="ghost" size="sm" onClick={() => openMission(mission, 'briefing')} className="h-auto w-full justify-start gap-2 truncate px-2 py-2 text-left text-[11px] font-normal text-muted-foreground hover:text-foreground"><span className="size-1.5 shrink-0 rounded-full bg-primary/70" /><span className="truncate">{mission.title}</span></Button>)}
        </div>

        <Card className="mt-auto gap-3 border-primary/10 bg-primary/[0.04] p-3.5 ring-0">
          <CardTitle className="text-xs">Sherpas disponíveis</CardTitle>
          <CardDescription className="text-[11px] leading-5">Especialistas prontos para construir com você.</CardDescription>
          <Badge variant="secondary" className="w-fit gap-1.5 text-[10px]"><span className="size-1.5 rounded-full bg-primary" /> 3 especialistas</Badge>
        </Card>
      </aside>

      <div className="min-w-0 flex-1 px-5 py-7 sm:px-7 lg:px-8 lg:py-8">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">Sua biblioteca de execução</p><h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Missões e Templates</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Escolha um ponto de partida. Seu Sherpa transforma o briefing em trabalho prático, lado a lado.</p></div>
          <Button type="button" onClick={() => openMission(missions[0], 'briefing')} className="h-9 gap-2 rounded-full px-4 text-xs font-semibold"><Sparkles data-icon="inline-start" /> Nova missão</Button>
        </header>

        <div className="mb-6 flex flex-col gap-3 lg:hidden">
          <InputGroup className="h-10 rounded-xl bg-input/20">
            <InputGroupInput value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar missão" aria-label="Buscar missão" className="text-xs" />
            <InputGroupAddon><Search /></InputGroupAddon>
          </InputGroup>
          <ToggleGroup multiple={false} spacing={1} value={[category]} onValueChange={(values) => { if (values[0]) setCategory(values[0] as CategoryFilter) }} aria-label="Filtrar missões por área" className="w-full gap-1 overflow-x-auto">
            {categories.map((item) => <ToggleGroupItem key={item} value={item} variant="outline" size="sm" className="rounded-full text-xs aria-pressed:bg-secondary aria-pressed:text-secondary-foreground">{item}</ToggleGroupItem>)}
          </ToggleGroup>
        </div>

        <section aria-labelledby="featured-missions" className="mb-10">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div><h2 id="featured-missions" className="text-lg font-semibold tracking-tight">Missões em destaque</h2><p className="mt-1 text-xs text-muted-foreground">Ativos guiados pelos Sherpas especialistas</p></div>
            <div className="flex items-center gap-2"><Button type="button" variant="outline" size="icon" aria-label="Missões anteriores" onClick={() => scrollRow(featuredRow, -1)}><ChevronLeft /></Button><Button type="button" variant="secondary" size="icon" aria-label="Próximas missões" onClick={() => scrollRow(featuredRow, 1)}><ChevronRight /></Button></div>
          </div>
          {visibleMissions.length ? <div ref={featuredRow} className="-mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {visibleMissions.map((mission) => <div key={mission.id} className="w-[min(82vw,330px)] shrink-0 snap-start"><MissionCard mission={mission} featured onStart={(item) => openMission(item, 'briefing')} onExample={(item) => openMission(item, 'example')} /></div>)}
          </div> : <Empty className="rounded-xl border border-dashed border-border bg-card/50">
            <EmptyHeader>
              <EmptyMedia variant="icon"><Search /></EmptyMedia>
              <EmptyTitle>Nenhuma missão encontrada</EmptyTitle>
              <EmptyDescription>Ajuste a busca ou escolha outra categoria.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent><Button type="button" variant="outline" size="sm" onClick={() => { setSearch(''); setCategory('Todas as missões') }}>Limpar filtros</Button></EmptyContent>
          </Empty>}
        </section>

        <section aria-labelledby="playbooks-heading">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div><h2 id="playbooks-heading" className="text-lg font-semibold tracking-tight">Templates <span className="ml-1 text-sm font-normal text-muted-foreground">{playbooks.length}</span></h2><p className="mt-1 text-xs text-muted-foreground">Playbooks rápidos para estruturar cada etapa</p></div>
            <div className="flex items-center gap-2"><Button type="button" variant="outline" size="icon" aria-label="Templates anteriores" onClick={() => scrollRow(playbookRow, -1)}><ChevronLeft /></Button><Button type="button" variant="secondary" size="icon" aria-label="Próximos templates" onClick={() => scrollRow(playbookRow, 1)}><ChevronRight /></Button></div>
          </div>
          <div ref={playbookRow} className="-mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {playbooks.map((playbook) => {
              const Icon = playbook.icon
              const mission = missions.find((item) => item.category === playbook.category) ?? missions[0]
              return <Card key={playbook.title} className="group min-h-[250px] w-[min(82vw,330px)] shrink-0 snap-start justify-between border-border/80 bg-card transition duration-300 hover:-translate-y-1 hover:ring-1 hover:ring-primary/20">
                <CardHeader className="gap-3">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Icon /></span>
                  <div className="flex items-start justify-between gap-2"><CardTitle className="text-sm leading-5">{playbook.title}</CardTitle><Badge variant="outline" className="shrink-0 text-[10px] text-muted-foreground">{playbook.category}</Badge></div>
                  <CardDescription className="min-h-10 text-xs leading-5">{playbook.description}</CardDescription>
                </CardHeader>
                <CardFooter className="gap-2 border-border px-4 py-3">
                  <Button type="button" size="sm" onClick={() => openMission(mission, 'briefing')} className="h-8 rounded-full px-4 text-xs">Usar</Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => openMission(mission, 'example')} className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground">Visualizar</Button>
                  <span className="ml-auto text-[10px] text-muted-foreground">Playbook</span>
                </CardFooter>
              </Card>
            })}
          </div>
        </section>
      </div>

      {selectedMission && <MissionBriefingModal key={`${selectedMission.id}-${modalMode}`} mission={selectedMission} initialMode={modalMode} onClose={() => setSelectedMission(null)} onStart={startMission} />}
    </div>
  )
}
