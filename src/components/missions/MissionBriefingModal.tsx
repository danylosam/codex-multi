'use client'

import { useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Layers3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { cn } from 'cn'
import { SherpaBadge } from './SherpaBadge'
import type { Mission } from './MissionCard'

const angles = [
  { name: 'Direto ao Ponto', description: 'Clareza e benefício em primeiro plano' },
  { name: 'Storytelling Emocional', description: 'Conexão pela história e identificação' },
  { name: 'Quebra de Paradigma', description: 'Uma nova perspectiva para o mercado' },
]

const awarenessOptions = [
  { value: 'Não percebe claramente o problema', label: 'Ainda não percebe o problema' },
  { value: 'Reconhece o problema, busca caminhos', label: 'Reconhece o problema e busca caminhos' },
  { value: 'Já conhece soluções, mas ainda não decidiu', label: 'Conhece soluções, mas ainda não decidiu' },
  { value: 'Conhece o produto e está avaliando a oferta', label: 'Conhece o produto e avalia a oferta' },
]

type MissionBriefingModalProps = {
  mission: Mission
  initialMode: 'briefing' | 'example'
  onClose: () => void
  onStart: (mission: Mission, briefing: string) => void
}

export function MissionBriefingModal({ mission, initialMode, onClose, onStart }: MissionBriefingModalProps) {
  const [mode, setMode] = useState(initialMode)
  const [angle, setAngle] = useState(angles[0].name)
  const [niche, setNiche] = useState('')
  const [promise, setPromise] = useState('')
  const [awareness, setAwareness] = useState(awarenessOptions[2].value)
  const estimatedTokens = useMemo(() => {
    const chars = `${mission.title}${angle}${niche}${promise}${awareness}`.length
    return Math.max(1, Math.ceil(chars / 4))
  }, [awareness, angle, mission.title, niche, promise])
  const MissionIcon = mission.icon

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const briefing = `Briefing da missão: ${mission.title} | Sherpa: ${mission.sherpa} | Ângulo: ${angle} | Nicho: ${niche.trim()} | Produto ou promessa: ${promise.trim()} | Consciência do público: ${awareness}`
    onStart(mission, briefing)
  }

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent showCloseButton className="grid h-[min(92dvh,800px)] max-h-[min(92dvh,800px)] max-w-6xl grid-cols-1 gap-0 overflow-hidden p-0 sm:max-w-6xl lg:grid-cols-[minmax(270px,0.72fr)_minmax(0,1.28fr)]">
        <aside className="flex max-h-52 flex-col gap-4 overflow-y-auto border-b border-border bg-card p-5 sm:max-h-60 lg:max-h-none lg:gap-6 lg:border-r lg:border-b-0 lg:p-7">
          <div className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase"><Layers3 className="size-4 text-primary" /> Central de Missões</div>
          <div className="flex items-start gap-4 lg:flex-col">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground lg:size-14">
              <MissionIcon className="size-5 lg:size-6" />
            </div>
            <div className="min-w-0">
              <Badge variant="secondary" className="w-fit rounded-full px-2 py-1 text-[10px] font-semibold tracking-[0.14em] text-primary uppercase">{mission.category} · Missão prática</Badge>
              <DialogTitle className="mt-2 text-xl leading-tight font-semibold tracking-tight text-foreground lg:text-2xl">{mission.title}</DialogTitle>
              <DialogDescription className="mt-2 max-w-sm text-xs leading-5 text-muted-foreground lg:mt-3 lg:text-sm lg:leading-6">{mission.description} Entrega: <span className="text-foreground/85">{mission.deliverable}</span>.</DialogDescription>
            </div>
          </div>

          <SherpaBadge name={`${mission.sherpa} · Gemini 2.5 Flash`} active />

          <div className="hidden flex-col gap-4 pt-3 lg:flex">
            <p className="text-[10px] font-semibold tracking-[0.15em] text-muted-foreground uppercase">Sua jornada</p>
            {[
              ['1', 'Parâmetros da oferta', 'Defina contexto e direção'],
              ['2', 'Co-criação com Sherpa', 'Construa cada parte em conjunto'],
              ['3', 'Ativo pronto', 'Revise e consolide a entrega'],
            ].map(([number, title, detail], index) => (
              <div key={number} className="flex items-start gap-3">
                <span className={cn('flex size-7 shrink-0 items-center justify-center rounded-full border text-xs', index === 0 ? 'border-primary/40 bg-primary/15 text-primary' : 'border-border bg-muted text-muted-foreground')}>
                  {index === 0 ? <Check className="size-3.5" /> : number}
                </span>
                <div className="pt-0.5"><p className="text-xs font-medium text-foreground">{title}</p><p className="mt-1 text-[11px] text-muted-foreground">{detail}</p></div>
              </div>
            ))}
          </div>
        </aside>

        <div className="flex min-h-0 flex-col bg-background">
          {mode === 'example' ? (
            <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-5 pt-12 sm:p-7 sm:pt-12">
              <div><p className="text-[10px] font-semibold tracking-[0.15em] text-primary uppercase">Prévia do entregável</p><h3 className="mt-2 text-xl font-semibold">Veja onde esta missão pode chegar</h3></div>
              <Card className="border-border/80 bg-card">
                <CardHeader><CardTitle className="text-base">{mission.title}</CardTitle><CardDescription>Exemplo de direção criativa</CardDescription></CardHeader>
                <CardContent className="flex flex-col gap-4 text-sm leading-7 text-muted-foreground">
                  <p>{mission.example}</p>
                  <p className="border-t border-border pt-4 text-xs leading-5">Exemplo ilustrativo. O resultado é desenvolvido com o contexto e as decisões do seu projeto.</p>
                </CardContent>
              </Card>
              <div className="mt-auto flex justify-between gap-3 pt-3">
                <Button type="button" variant="ghost" onClick={onClose} className="gap-2 text-muted-foreground"><ArrowLeft data-icon="inline-start" /> Voltar ao hub</Button>
                <Button type="button" onClick={() => setMode('briefing')} className="gap-2">Configurar missão <ArrowRight data-icon="inline-end" /></Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
              <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-5 pt-12 sm:p-7 sm:pt-12">
                <header><p className="text-[10px] font-semibold tracking-[0.15em] text-primary uppercase">Etapa 1 de 3</p><h3 className="mt-2 text-xl font-semibold">Vamos alinhar o ponto de partida</h3><p className="mt-1 text-sm text-muted-foreground">Algumas informações ajudam o Sherpa a construir com o seu contexto.</p></header>

                <FieldSet>
                  <FieldLegend variant="label" className="text-sm">Escolha o ângulo de comunicação</FieldLegend>
                  <ToggleGroup multiple={false} spacing={3} value={[angle]} onValueChange={(values) => { if (values[0]) setAngle(values[0]) }} aria-label="Ângulo de comunicação" className="grid w-full grid-cols-1 sm:grid-cols-3">
                    {angles.map((option) => (
                      <ToggleGroupItem key={option.name} value={option.name} variant="outline" className="h-auto min-h-36 w-full flex-col items-stretch justify-start rounded-xl p-3 text-left whitespace-normal transition aria-pressed:border-primary/50 aria-pressed:bg-primary/[0.06]">
                        <span className="mt-1 block text-xs font-medium text-foreground">{option.name}</span>
                        <span className="mt-2 block text-[11px] leading-5 text-muted-foreground">{option.description}</span>
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </FieldSet>

                <FieldGroup className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="mission-niche">Nicho de mercado</FieldLabel>
                    <Input id="mission-niche" value={niche} onChange={(event) => setNiche(event.target.value)} placeholder="Ex.: educação financeira" required className="h-10 rounded-xl" />
                    <FieldDescription>Para quem esta missão será construída?</FieldDescription>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="mission-promise">Produto e promessa principal</FieldLabel>
                    <Input id="mission-promise" value={promise} onChange={(event) => setPromise(event.target.value)} placeholder="Qual resultado seu produto entrega?" required className="h-10 rounded-xl" />
                    <FieldDescription>Inclua o benefício central da oferta.</FieldDescription>
                  </Field>
                </FieldGroup>

                <Field>
                  <FieldLabel htmlFor="mission-awareness">Nível de consciência do público</FieldLabel>
                  <Select value={awareness} onValueChange={(value) => { if (value) setAwareness(value) }}>
                    <SelectTrigger id="mission-awareness" className="h-10 rounded-xl"><SelectValue placeholder="Selecione o nível de consciência" /></SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {awarenessOptions.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FieldDescription>Isso calibra o ponto de partida da comunicação.</FieldDescription>
                </Field>
              </div>

              <footer className="sticky bottom-0 flex flex-wrap items-center justify-between gap-3 border-t border-border bg-card px-5 py-4 sm:px-7">
                <div><p className="text-xs font-medium text-foreground">Estimativa do briefing</p><p className="mt-1 text-[11px] text-muted-foreground">~{estimatedTokens} tokens · estimativa inicial</p></div>
                <Button type="submit" className="h-10 gap-2 rounded-xl px-4 font-semibold">Avançar para o Sherpa <ArrowRight data-icon="inline-end" /></Button>
              </footer>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
