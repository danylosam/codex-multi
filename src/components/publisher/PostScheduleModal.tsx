'use client'

import { useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import { createSocialPost, generateSocialCaption } from '@/app/(private)/workspace/publisher/actions'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CalendarClock, ImagePlus, LoaderCircle, Sparkles } from 'lucide-react'

export function PostScheduleModal({ open, onOpenChange, intent }: { open: boolean; onOpenChange: (open: boolean) => void; intent: 'create' | 'schedule' }) {
  const [pending, setPending] = useState(false)
  const [drafting, setDrafting] = useState(false)
  const [platform, setPlatform] = useState('instagram')
  const [caption, setCaption] = useState('')
  const [briefing, setBriefing] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    const result = await createSocialPost(new FormData(event.currentTarget))
    setPending(false)
    if (result.error) {
      toast.error('Não foi possível criar o post', { description: result.error })
      return
    }
    toast.success('Post adicionado à esteira')
    onOpenChange(false)
  }

  async function handleDraftCaption() {
    setDrafting(true)
    const result = await generateSocialCaption(briefing)
    setDrafting(false)
    if ('error' in result) toast.error('O Sherpa não conseguiu gerar a legenda', { description: result.error })
    else { setCaption(result.caption); toast.success('Legenda criada pelo Sherpa') }
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setCaption('')
      setBriefing('')
      setPlatform('instagram')
    }
    onOpenChange(nextOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-xl">
        <DialogHeader className="pr-8">
          <div className="mb-1 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Sparkles className="size-5" /></div>
          <DialogTitle className="text-xl">{intent === 'schedule' ? 'Agendar publicação' : 'Preparar publicação'}</DialogTitle>
          <DialogDescription>Adicione o criativo e a legenda. A imagem será armazenada temporariamente até a publicação.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="platform">Canal</Label>
              <Select value={platform} onValueChange={(value) => value && setPlatform(value)}>
                <SelectTrigger id="platform" className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="instagram">Instagram</SelectItem><SelectItem value="facebook">Facebook Page</SelectItem></SelectContent>
              </Select>
              <input type="hidden" name="platform" value={platform} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="scheduled_at">Agendar para {intent === 'create' && <span className="font-normal text-muted-foreground">(opcional)</span>}</Label>
              <Input id="scheduled_at" name="scheduled_at" type="datetime-local" required={intent === 'schedule'} min={new Date(Date.now() + 60_000).toISOString().slice(0, 16)} />
              {intent === 'schedule' && <input type="hidden" name="schedule_required" value="true" />}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Imagem do post</Label>
              <Input id="image" name="image" type="file" accept={platform === 'instagram' ? 'image/jpeg' : 'image/jpeg,image/png,image/webp'} required className="h-11 file:mr-3" />
            <p className="text-xs text-muted-foreground">{platform === 'instagram' ? 'JPEG' : 'JPG, PNG ou WebP'} · até 10 MB. O arquivo fica público enquanto aguarda a publicação.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="prompt_image">Briefing visual para o Sherpa <span className="font-normal text-muted-foreground">(opcional)</span></Label>
            <Input id="prompt_image" name="prompt_image" placeholder="Ex.: criativo editorial para lançamento de produto" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="briefing">Contexto da publicação</Label>
            <Textarea id="briefing" value={briefing} onChange={(event) => setBriefing(event.target.value)} rows={2} maxLength={2500} placeholder="Produto, público, benefício e objetivo do post…" />
            <Button type="button" variant="outline" size="sm" onClick={handleDraftCaption} disabled={drafting || pending}><Sparkles />{drafting ? 'Sherpa escrevendo…' : 'Rascunhar legenda com Sherpa'}</Button>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between"><Label htmlFor="caption">Legenda</Label><span className="text-xs text-muted-foreground">Ajustável depois</span></div>
            <Textarea id="caption" name="caption" value={caption} onChange={(event) => setCaption(event.target.value)} required maxLength={2200} rows={5} placeholder="Escreva a legenda ou peça ao Sherpa para criar um rascunho…" />
          </div>
          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={pending}>{pending ? <><LoaderCircle className="animate-spin" />Salvando…</> : intent === 'schedule' ? <><CalendarClock />Agendar post</> : <><CalendarClock />Adicionar à esteira</>}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
