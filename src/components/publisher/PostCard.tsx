'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { deleteSocialPost, publishPostNow, updatePostCaption } from '@/app/(private)/workspace/publisher/actions'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { Check, ChevronDown, Clock3, Image as ImageIcon, LoaderCircle, Pencil, Send, Trash2 } from 'lucide-react'

export type PublisherPost = {
  id: string
  platform: 'instagram' | 'facebook'
  caption: string
  visual_prompt: string | null
  image_url: string | null
  scheduled_for: string | null
  status: 'pending' | 'processing' | 'published' | 'failed'
  created_at: string
}

const statusStyle: Record<PublisherPost['status'], string> = {
  pending: 'border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300',
  processing: 'border-sky-500/25 bg-sky-500/10 text-sky-700 dark:text-sky-300',
  published: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  failed: 'border-destructive/25 bg-destructive/10 text-destructive',
}

function statusLabel(post: PublisherPost) {
  if (post.status === 'pending' && post.scheduled_for) {
    return `Na fila · ${new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(post.scheduled_for))}`
  }
  if (post.status === 'processing') return 'Gerando arte e publicando…'
  if (post.status === 'published') return 'Publicado no feed'
  return 'Falha na publicação'
}

export function PostCard({ post, history = false }: { post: PublisherPost; history?: boolean }) {
  const [expanded, setExpanded] = useState(false)
  const [editing, setEditing] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [caption, setCaption] = useState(post.caption)
  const [pending, startTransition] = useTransition()
  const canAct = ['pending', 'failed'].includes(post.status)
  const hasImage = Boolean(post.image_url)

  function publish() {
    startTransition(async () => {
      const result = await publishPostNow(post.id)
      if (result.error) toast.error('Erro ao priorizar post', { description: result.error })
      else toast.success('Post priorizado', { description: 'Será publicado na próxima execução do Make.' })
    })
  }

  function saveCaption() {
    startTransition(async () => {
      const result = await updatePostCaption(post.id, caption)
      if (result.error) toast.error('Legenda não atualizada', { description: result.error })
      else { toast.success('Legenda atualizada'); setEditing(false) }
    })
  }

  function remove() {
    if (!window.confirm('Excluir este post da fila?')) return
    startTransition(async () => {
      const result = await deleteSocialPost(post.id)
      if (result.error) toast.error('Post não excluído', { description: result.error })
      else toast.success('Post removido da fila')
    })
  }

  return (
    <Card className="gap-0 overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-colors hover:border-primary/25">
      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        {hasImage ? (
          <>
            <img src={post.image_url!} alt={post.visual_prompt || 'Imagem do post'} loading="lazy" onLoad={() => setImageLoaded(true)} onError={() => setImageLoaded(true)} className={`size-full object-cover transition-opacity ${imageLoaded ? 'opacity-100' : 'opacity-0'}`} />
            {!imageLoaded && <Skeleton className="absolute inset-0 rounded-none" />}
          </>
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-1.5 text-muted-foreground">
            <ImageIcon className="size-7 opacity-60" />
            <span className="text-xs">Arte será gerada por IA no Make</span>
          </div>
        )}
        <Badge variant="outline" className={`absolute left-3 top-3 backdrop-blur-md ${statusStyle[post.status]}`}>
          {post.status === 'processing' ? <LoaderCircle className="animate-spin" /> : post.status === 'published' ? <Check /> : <Clock3 />}
          {statusLabel(post)}
        </Badge>
        <Badge variant="secondary" className="absolute right-3 top-3 capitalize backdrop-blur-md">{post.platform === 'instagram' ? 'Instagram' : 'Facebook'}</Badge>
      </div>
      <div className="space-y-4 p-4">
        {post.visual_prompt && <p className="line-clamp-2 text-xs font-medium text-primary">Prompt IA · {post.visual_prompt}</p>}
        {editing ? (
          <div className="space-y-2">
            <Textarea value={caption} onChange={(event) => setCaption(event.target.value)} rows={4} maxLength={2200} />
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="ghost" onClick={() => { setCaption(post.caption); setEditing(false) }}>Cancelar</Button>
              <Button size="sm" onClick={saveCaption} disabled={pending}>{pending ? 'Salvando…' : 'Salvar legenda'}</Button>
            </div>
          </div>
        ) : (
          <div>
            <p className={`whitespace-pre-wrap text-sm leading-6 text-foreground/85 ${expanded ? '' : 'line-clamp-3'}`}>{post.caption}</p>
            {post.caption.length > 150 && (
              <button onClick={() => setExpanded(!expanded)} className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                {expanded ? 'Recolher' : 'Expandir'}
                <ChevronDown className={`size-3 transition-transform ${expanded ? 'rotate-180' : ''}`} />
              </button>
            )}
          </div>
        )}
        <div className="flex flex-wrap items-center gap-2 border-t border-border pt-3">
          {canAct && !history && (
            <>
              <Button size="sm" onClick={publish} disabled={pending}><Send />{pending ? 'Atualizando…' : 'Priorizar agora'}</Button>
              <Button variant="outline" size="sm" onClick={() => setEditing(!editing)} disabled={pending}><Pencil />Editar legenda</Button>
              <Button variant="ghost" size="icon-sm" aria-label="Excluir da fila" title="Excluir da fila" onClick={remove} disabled={pending} className="ml-auto text-muted-foreground hover:text-destructive"><Trash2 /></Button>
            </>
          )}
          {history && <span className="ml-auto text-xs text-muted-foreground">Publicado via Make</span>}
        </div>
      </div>
    </Card>
  )
}