'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { deleteSocialPost, publishPostNow, updatePostCaption } from '@/app/(private)/workspace/publisher/actions'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { ArrowUpRight, Check, ChevronDown, Clock3, Image as ImageIcon, LoaderCircle, Pencil, Send, Trash2 } from 'lucide-react'

export type PublisherPost = {
  id: string
  platform: 'instagram' | 'facebook'
  caption: string
  prompt_image: string | null
  temp_storage_path: string | null
  public_image_url: string | null
  scheduled_at: string | null
  status: 'draft' | 'scheduled' | 'publishing' | 'published' | 'failed'
  permalink: string | null
  created_at: string
}

const statusStyle: Record<PublisherPost['status'], string> = {
  draft: 'border-border bg-muted text-muted-foreground',
  scheduled: 'border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300',
  publishing: 'border-sky-500/25 bg-sky-500/10 text-sky-700 dark:text-sky-300',
  published: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  failed: 'border-destructive/25 bg-destructive/10 text-destructive',
}

function statusLabel(post: PublisherPost) {
  if (post.status === 'scheduled' && post.scheduled_at) return `Agendado · ${new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(post.scheduled_at))}`
  if (post.status === 'publishing') return 'Publicando…'
  if (post.status === 'published') return 'Publicado no feed'
  if (post.status === 'failed') return 'Falha na publicação'
  return 'Rascunho'
}

export function PostCard({ post, history = false }: { post: PublisherPost; history?: boolean }) {
  const [expanded, setExpanded] = useState(false)
  const [editing, setEditing] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [caption, setCaption] = useState(post.caption)
  const [pending, startTransition] = useTransition()
  const canAct = ['draft', 'scheduled', 'failed'].includes(post.status)
  const imageIsTemporary = Boolean(post.temp_storage_path && post.public_image_url?.includes('/storage/v1/object/public/'))

  function publish() {
    startTransition(async () => {
      const result = await publishPostNow(post.id)
      if (result.error) toast.error('Publicação não concluída', { description: result.error })
      else toast.success('Post publicado', { description: 'A imagem temporária foi removida do Storage.' })
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
    if (!window.confirm('Excluir este post da fila e remover a imagem temporária?')) return
    startTransition(async () => {
      const result = await deleteSocialPost(post.id)
      if (result.error) toast.error('Post não excluído', { description: result.error })
      else toast.success('Post removido da fila')
    })
  }

  return (
    <Card className="gap-0 rounded-2xl border border-border bg-card shadow-sm transition-colors hover:border-primary/25">
      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        {imageIsTemporary ? <><img src={post.public_image_url!} alt={post.prompt_image || 'Imagem do post'} loading="lazy" onLoad={() => setImageLoaded(true)} onError={() => setImageLoaded(true)} className={`size-full object-cover transition-opacity ${imageLoaded ? 'opacity-100' : 'opacity-0'}`} />{!imageLoaded && <Skeleton className="absolute inset-0 rounded-none" />}</> : <div className="flex size-full items-center justify-center text-muted-foreground"><ImageIcon className="size-8" /></div>}
        <Badge variant="outline" className={`absolute left-3 top-3 backdrop-blur-md ${statusStyle[post.status]}`}>
          {post.status === 'publishing' ? <LoaderCircle className="animate-spin" /> : post.status === 'published' ? <Check /> : <Clock3 />}{statusLabel(post)}
        </Badge>
        <Badge variant="secondary" className="absolute right-3 top-3 capitalize backdrop-blur-md">{post.platform === 'instagram' ? 'Instagram' : 'Facebook'}</Badge>
      </div>
      <div className="space-y-4 p-4">
        {post.prompt_image && <p className="text-xs font-medium text-primary">Briefing · {post.prompt_image}</p>}
        {editing ? <div className="space-y-2"><Textarea value={caption} onChange={(event) => setCaption(event.target.value)} rows={4} maxLength={2200} /><div className="flex justify-end gap-2"><Button size="sm" variant="ghost" onClick={() => { setCaption(post.caption); setEditing(false) }}>Cancelar</Button><Button size="sm" onClick={saveCaption} disabled={pending}>{pending ? 'Salvando…' : 'Salvar legenda'}</Button></div></div> : <div>
          <p className={`whitespace-pre-wrap text-sm leading-6 text-foreground/85 ${expanded ? '' : 'line-clamp-3'}`}>{post.caption}</p>
          {post.caption.length > 150 && <button onClick={() => setExpanded(!expanded)} className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">{expanded ? 'Recolher' : 'Expandir'}<ChevronDown className={`size-3 transition-transform ${expanded ? 'rotate-180' : ''}`} /></button>}
        </div>}
        <div className="flex flex-wrap items-center gap-2 border-t border-border pt-3">
          {history && post.permalink ? <a href={post.permalink} target="_blank" rel="noreferrer" className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-medium text-primary-foreground">Ver no feed<ArrowUpRight className="size-3.5" /></a> : canAct && <Button size="sm" onClick={publish} disabled={pending}><Send />{pending ? 'Publicando…' : 'Publicar agora'}</Button>}
          {canAct && !history && <><Button variant="outline" size="sm" onClick={() => setEditing(!editing)} disabled={pending}><Pencil />Editar legenda</Button><Button variant="ghost" size="icon-sm" aria-label="Excluir da fila" title="Excluir da fila" onClick={remove} disabled={pending} className="ml-auto text-muted-foreground hover:text-destructive"><Trash2 /></Button></>}
          {history && <span className="ml-auto text-xs text-muted-foreground">Hospedado no Instagram · 0 MB no Storage</span>}
        </div>
      </div>
    </Card>
  )
}
