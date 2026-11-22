'use client'

import { useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import { createAutopilotRule } from '@/app/(private)/workspace/publisher/actions'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Bot, LoaderCircle } from 'lucide-react'

const hours = Array.from({ length: 24 }, (_, i) => ({
  value: String(i),
  label: `${String(i).padStart(2, '0')}:00`,
}))

export function AutopilotModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [pending, setPending] = useState(false)
  const [platform, setPlatform] = useState('instagram')
  const [startHour, setStartHour] = useState('6')
  const [endHour, setEndHour] = useState('12')
  const [intervalHours, setIntervalHours] = useState('1')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    const result = await createAutopilotRule(new FormData(event.currentTarget))
    setPending(false)
    if (result.error) {
      toast.error('Atenção no Piloto Automático', { description: result.error })
      return
    }
    toast.success('Piloto Automático ativado!', {
      description: 'Os próximos horários já foram gerados com IA e entraram na fila.',
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-xl">
        <DialogHeader className="pr-8">
          <div className="mb-1 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Bot className="size-5" />
          </div>
          <DialogTitle className="text-xl">Configurar Piloto Automático</DialogTitle>
          <DialogDescription>
            A IA criará legendas e prompts visuais exclusivos diariamente dentro da janela escolhida e enviará automaticamente para o Make publicar.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Canal</Label>
              <Select value={platform} onValueChange={(v) => v && setPlatform(v)}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="facebook">Facebook Page</SelectItem>
                </SelectContent>
              </Select>
              <input type="hidden" name="platform" value={platform} />
            </div>

            <div className="space-y-2">
              <Label>Frequência</Label>
              <Select value={intervalHours} onValueChange={(v) => v && setIntervalHours(v)}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">De hora em hora (1h)</SelectItem>
                  <SelectItem value="2">A cada 2 horas</SelectItem>
                  <SelectItem value="3">A cada 3 horas</SelectItem>
                  <SelectItem value="4">A cada 4 horas</SelectItem>
                  <SelectItem value="6">A cada 6 horas</SelectItem>
                  <SelectItem value="24">1x por dia (no horário inicial)</SelectItem>
                </SelectContent>
              </Select>
              <input type="hidden" name="interval_hours" value={intervalHours} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Início diário (Brasília)</Label>
              <Select value={startHour} onValueChange={(v) => v && setStartHour(v)}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {hours.map((h) => (
                    <SelectItem key={h.value} value={h.value}>{h.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input type="hidden" name="start_hour" value={startHour} />
            </div>

            <div className="space-y-2">
              <Label>Término diário (Brasília)</Label>
              <Select value={endHour} onValueChange={(v) => v && setEndHour(v)}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {hours.map((h) => (
                    <SelectItem key={h.value} value={h.value}>{h.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input type="hidden" name="end_hour" value={endHour} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="theme">Tema central das publicações</Label>
            <Textarea
              id="theme"
              name="theme"
              required
              rows={3}
              placeholder="Ex.: Dicas práticas de inteligência artificial, produtividade e automação para empreendedores e criadores digitais"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="visual_style">Direção visual das artes (em inglês, opcional)</Label>
            <Input
              id="visual_style"
              name="visual_style"
              placeholder="Ex.: Minimalist 3D futuristic dark glass, glowing indigo accents, ultra clean SaaS aesthetic, 4k"
            />
          </div>

          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={pending}>
              {pending ? <><LoaderCircle className="animate-spin" />Gerando esteira com IA…</> : <><Bot />Ativar Piloto Automático</>}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}