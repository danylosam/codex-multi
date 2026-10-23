'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Layers3, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SherpaBadge } from './SherpaBadge'
import type { Mission } from './MissionCard'

const angles = [
  { name: 'Direto ao Ponto', description: 'Clareza e benefício em primeiro plano', mark: '01' },
  { name: 'Storytelling Emocional', description: 'Conexão pela história e identificação', mark: '02' },
  { name: 'Quebra de Paradigma', description: 'Uma nova perspectiva para o mercado', mark: '03' },
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
  const [awareness, setAwareness] = useState('Já conhece soluções, mas ainda não decidiu')
  const estimatedTokens = useMemo(() => {
    const chars = `${mission.title}${angle}${niche}${promise}${awareness}`.length
    return Math.max(1, Math.ceil(chars / 4))
  }, [awareness, angle, mission.title, niche, promise])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const briefing = `Briefing da missão: ${mission.title} | Sherpa: ${mission.sherpa} | Ângulo: ${angle} | Nicho: ${niche.trim()} | Produto ou promessa: ${promise.trim()} | Consciência do público: ${awareness}`
    onStart(mission, briefing)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-3 backdrop-blur-sm sm:p-6" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section role="dialog" aria-modal="true" aria-labelledby="mission-dialog-title" className="relative my-auto grid w-full max-w-5xl overflow-hidden rounded-2xl border border-zinc-700/80 bg-zinc-950 shadow-2xl shadow-black/60 lg:min-h-[640px] lg:grid-cols-[0.85fr_1.15fr]">
        <button type="button" onClick={onClose} aria-label="Fechar briefing" className="absolute right-4 top-4 z-10 flex size-9 items-center justify-center rounded-full border border-white/10 bg-black/30 text-zinc-400 transition hover:bg-white/10 hover:text-white">
          <X className="size-4" />
        </button>

        <aside className="relative flex flex-col overflow-hidden border-b border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-6 sm:p-8 lg:border-r lg:border-b-0">
          <div className="pointer-events-none absolute -left-28 top-24 size-72 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="relative flex items-center gap-2 text-xs font-medium tracking-[0.18em] text-zinc-500 uppercase"><Layers3 className="size-4 text-indigo-300" /> Central de Missões</div>
          <div className="relative mt-10">
            <div className="mb-5 flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-indigo-100"><mission.icon className="size-6" /></div>
            <p className="text-xs font-semibold tracking-[0.16em] text-indigo-200/80 uppercase">Missão prática</p>
            <h2 id="mission-dialog-title" className="mt-3 max-w-sm text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl">{mission.title}</h2>
            <p className="mt-4 max-w-sm text-sm leading-6 text-zinc-400">{mission.description} O objetivo é sair com <span className="text-zinc-200">{mission.deliverable}</span>.</p>
          </div>
          <div className="relative mt-7"><SherpaBadge name={`${mission.sherpa} · Gemini 2.5 Flash`} active /></div>

          <div className="relative mt-auto pt-10">
            <p className="mb-4 text-[11px] font-semibold tracking-[0.15em] text-zinc-500 uppercase">Sua jornada</p>
            {[
              ['1', 'Parâmetros da oferta', 'Defina contexto e direção'],
              ['2', 'Co-criação com Sherpa', 'Construa cada parte em conjunto'],
              ['3', 'Ativo pronto', 'Revise e consolide a entrega'],
            ].map(([number, title, detail], index) => (
              <div key={number} className="flex gap-3 pb-4 last:pb-0">
                <div className="flex flex-col items-center">
                  <span className={`flex size-7 items-center justify-center rounded-full border text-xs ${index === 0 ? 'border-indigo-300/40 bg-indigo-300/15 text-indigo-100' : 'border-zinc-700 bg-zinc-900 text-zinc-500'}`}>{index === 0 ? <Check className="size-3.5" /> : number}</span>
                  {index < 2 && <span className="mt-1 h-5 w-px bg-zinc-800" />}
                </div>
                <div className="pt-0.5"><p className={`text-xs font-medium ${index === 0 ? 'text-zinc-200' : 'text-zinc-400'}`}>{title}</p><p className="mt-1 text-[11px] text-zinc-600">{detail}</p></div>
              </div>
            ))}
          </div>
        </aside>

        <div className="flex min-h-0 flex-col">
          {mode === 'example' ? (
            <div className="flex flex-1 flex-col p-6 pt-14 sm:p-8 sm:pt-14">
              <p className="text-xs font-semibold tracking-[0.15em] text-indigo-200/80 uppercase">Prévia do entregável</p>
              <h3 className="mt-3 text-xl font-semibold text-white">Veja onde esta missão pode chegar</h3>
              <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/70 p-5 text-sm leading-7 text-zinc-300">
                <p className="font-medium text-white">{mission.title}</p>
                <p className="mt-3">{mission.example}</p>
                <p className="mt-4 border-t border-zinc-800 pt-4 text-xs text-zinc-500">Exemplo ilustrativo. O resultado é desenvolvido com o contexto e as decisões do seu projeto.</p>
              </div>
              <div className="mt-auto flex justify-between gap-3 pt-8">
                <Button type="button" variant="ghost" onClick={onClose} className="gap-2 text-zinc-400"><ArrowLeft className="size-4" /> Voltar ao hub</Button>
                <Button type="button" onClick={() => setMode('briefing')} className="gap-2 bg-zinc-100 text-zinc-950 hover:bg-white">Configurar missão <ArrowRight className="size-4" /></Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
              <div className="flex-1 space-y-6 overflow-y-auto p-6 pt-14 sm:p-8 sm:pt-14">
                <div><p className="text-xs font-semibold tracking-[0.15em] text-indigo-200/80 uppercase">Etapa 1 de 3</p><h3 className="mt-2 text-xl font-semibold text-white">Vamos alinhar o ponto de partida</h3><p className="mt-1 text-sm text-zinc-500">Algumas informações ajudam o Sherpa a construir com o seu contexto.</p></div>

                <fieldset>
                  <legend className="mb-3 text-sm font-medium text-zinc-200">Escolha o ângulo de comunicação</legend>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {angles.map((option) => (
                      <button key={option.name} type="button" onClick={() => setAngle(option.name)} aria-pressed={angle === option.name} className={`rounded-xl border p-3 text-left transition ${angle === option.name ? 'border-indigo-300/50 bg-indigo-300/[0.08] ring-1 ring-indigo-300/20' : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'}`}>
                        <span className={`text-[10px] font-semibold tracking-wider ${angle === option.name ? 'text-indigo-200' : 'text-zinc-600'}`}>{option.mark}</span>
                        <span className="mt-2 block text-xs font-medium text-zinc-200">{option.name}</span>
                        <span className="mt-1 block text-[10px] leading-4 text-zinc-500">{option.description}</span>
                      </button>
                    ))}
                  </div>
                </fieldset>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2 text-sm font-medium text-zinc-200">Nicho de mercado
                    <Input value={niche} onChange={(event) => setNiche(event.target.value)} placeholder="Ex.: educação financeira" required className="h-10 rounded-xl border-zinc-800 bg-zinc-900/60 text-sm text-zinc-100 placeholder:text-zinc-600" />
                  </label>
                  <label className="space-y-2 text-sm font-medium text-zinc-200">Produto e promessa principal
                    <Input value={promise} onChange={(event) => setPromise(event.target.value)} placeholder="O que oferece e qual resultado entrega?" required className="h-10 rounded-xl border-zinc-800 bg-zinc-900/60 text-sm text-zinc-100 placeholder:text-zinc-600" />
                  </label>
                </div>

                <label className="block space-y-2 text-sm font-medium text-zinc-200">Nível de consciência do público
                  <select value={awareness} onChange={(event) => setAwareness(event.target.value)} className="h-10 w-full rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 text-sm text-zinc-200 outline-none transition focus:border-indigo-300/50 focus:ring-2 focus:ring-indigo-300/10">
                    <option>Não percebe claramente o problema</option>
                    <option>Reconhece o problema, busca caminhos</option>
                    <option>Já conhece soluções, mas ainda não decidiu</option>
                    <option>Conhece o produto e está avaliando a oferta</option>
                  </select>
                </label>
              </div>

              <footer className="sticky bottom-0 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800 bg-zinc-950/95 px-6 py-4 backdrop-blur sm:px-8">
                <div><p className="text-xs font-medium text-zinc-300">Estimativa do briefing</p><p className="mt-1 text-[11px] text-zinc-500">~{estimatedTokens} tokens · estimativa inicial</p></div>
                <Button type="submit" className="h-10 gap-2 rounded-xl bg-white px-4 font-semibold text-zinc-950 hover:bg-zinc-200">Avançar para o Sherpa <ArrowRight className="size-4" /></Button>
              </footer>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}
