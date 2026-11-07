import 'server-only'

import type { createClient } from '@/lib/supabase/server'

type SupabaseClient = Awaited<ReturnType<typeof createClient>>

const bucket = 'instagram-temp'
const apiVersion = process.env.META_GRAPH_API_VERSION || 'v25.0'
const graphBase = `https://graph.facebook.com/${apiVersion}`

type SocialPost = {
  id: string
  user_id: string
  platform: 'instagram' | 'facebook'
  caption: string
  temp_storage_path: string | null
  public_image_url: string | null
  status: string
}

type MetaResponse = { id?: string; post_id?: string; permalink?: string; permalink_url?: string; status_code?: string; error?: { message?: string } }

function required(value: string | undefined, label: string) {
  if (!value) throw new Error(`Configuração ausente: ${label}`)
  return value
}

async function graphRequest(path: string, token: string, init?: RequestInit): Promise<MetaResponse> {
  const response = await fetch(`${graphBase}/${path}`, {
    ...init,
    headers: { ...(init?.headers ?? {}), Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })
  const payload = (await response.json()) as MetaResponse
  if (!response.ok || payload.error) throw new Error(payload.error?.message || `Meta Graph API retornou HTTP ${response.status}`)
  return payload
}

async function publishInstagram(post: SocialPost) {
  const igUserId = required(process.env.META_INSTAGRAM_ACCOUNT_ID, 'META_INSTAGRAM_ACCOUNT_ID')
  const token = required(process.env.META_INSTAGRAM_ACCESS_TOKEN, 'META_INSTAGRAM_ACCESS_TOKEN')
  const imageUrl = required(post.public_image_url ?? undefined, 'URL pública da imagem')
  const form = new URLSearchParams({ image_url: imageUrl, caption: post.caption })
  const container = await graphRequest(`${igUserId}/media`, token, { method: 'POST', body: form })
  const containerId = required(container.id, 'ID do container Instagram')

  let ready = false
  for (let attempt = 0; attempt < 12; attempt++) {
    const state = await graphRequest(`${containerId}?fields=status_code`, token)
    if (state.status_code === 'FINISHED') { ready = true; break }
    if (state.status_code === 'ERROR' || state.status_code === 'EXPIRED') throw new Error(`Container Instagram em estado ${state.status_code}`)
    await new Promise((resolve) => setTimeout(resolve, 5000))
  }
  if (!ready) throw new Error('A Meta não concluiu o processamento da imagem dentro do tempo limite.')

  const published = await graphRequest(`${igUserId}/media_publish`, token, {
    method: 'POST', body: new URLSearchParams({ creation_id: containerId }),
  })
  const mediaId = required(published.id, 'ID da publicação Instagram')
  const media = await graphRequest(`${mediaId}?fields=id,permalink`, token)
  return { mediaId, permalink: required(media.permalink, 'permalink Instagram') }
}

async function publishFacebook(post: SocialPost) {
  const pageId = required(process.env.META_FACEBOOK_PAGE_ID, 'META_FACEBOOK_PAGE_ID')
  const token = required(process.env.META_FACEBOOK_PAGE_ACCESS_TOKEN, 'META_FACEBOOK_PAGE_ACCESS_TOKEN')
  const imageUrl = required(post.public_image_url ?? undefined, 'URL pública da imagem')
  const form = new URLSearchParams({ url: imageUrl, caption: post.caption })
  const result = await graphRequest(`${pageId}/photos`, token, { method: 'POST', body: form })
  const mediaId = required(result.post_id ?? result.id, 'ID da publicação Facebook')
  const media = await graphRequest(`${mediaId}?fields=permalink_url`, token)
  return { mediaId, permalink: required(media.permalink_url, 'permalink Facebook') }
}

async function clearTemporaryImage(supabase: SupabaseClient, path: string | null) {
  if (!path) return
  const { error } = await supabase.storage.from(bucket).remove([path])
  if (error) throw new Error(`Publicado, mas a imagem temporária não foi removida: ${error.message}`)
}

export async function publishSocialPost(supabase: SupabaseClient, postId: string, userId: string) {
  const { data: post, error: loadError } = await supabase
    .from('social_posts').select('*').eq('id', postId).eq('user_id', userId).single()
  if (loadError || !post) throw new Error('Post não encontrado ou sem permissão.')
  if (!['draft', 'scheduled', 'failed'].includes(post.status)) throw new Error('Este post já está sendo processado ou foi publicado.')
  if (!post.public_image_url) throw new Error('Adicione uma imagem antes de publicar.')

  const { data: claimed, error: claimError } = await supabase
    .from('social_posts').update({ status: 'publishing' }).eq('id', postId).eq('user_id', userId).in('status', ['draft', 'scheduled', 'failed']).select('*').maybeSingle()
  if (claimError || !claimed) throw new Error('Não foi possível reservar este post para publicação.')

  try {
    const result = claimed.platform === 'facebook' ? await publishFacebook(claimed as SocialPost) : await publishInstagram(claimed as SocialPost)
    const update: Record<string, string | null> = {
      status: 'published', permalink: result.permalink, public_image_url: result.permalink,
      scheduled_at: null,
    }
    if (claimed.platform === 'facebook') update.facebook_post_id = result.mediaId
    else update.instagram_post_id = result.mediaId
    const { error } = await supabase.from('social_posts').update(update).eq('id', postId).eq('user_id', userId)
    if (error) throw new Error(`Post publicado, mas não foi possível salvar o histórico: ${error.message}`)
    // Keep the object path until the DB confirms publication, then clean it immediately.
    // The cron cleanup retries removal if Storage is temporarily unavailable.
    try {
      await clearTemporaryImage(supabase, claimed.temp_storage_path)
      if (claimed.temp_storage_path) {
        await supabase.from('social_posts').update({ temp_storage_path: null }).eq('id', postId).eq('user_id', userId)
      }
    } catch (cleanupError) {
      console.warn('[social-publisher] Imagem publicada permanece pendente de limpeza:', cleanupError)
    }
    return { permalink: result.permalink }
  } catch (error) {
    await supabase.from('social_posts').update({ status: 'failed' }).eq('id', postId).eq('user_id', userId).eq('status', 'publishing')
    throw error
  }
}

export async function cleanupPublishedImages(supabase: SupabaseClient, limit = 50) {
  const { data, error } = await supabase.from('social_posts').select('id,user_id,temp_storage_path').eq('status', 'published').not('temp_storage_path', 'is', null).limit(limit)
  if (error) throw new Error(error.message)
  let removed = 0
  for (const row of data ?? []) {
    const { error: removeError } = await supabase.storage.from(bucket).remove([row.temp_storage_path])
    if (removeError) continue
    await supabase.from('social_posts').update({ temp_storage_path: null }).eq('id', row.id).eq('user_id', row.user_id)
    removed++
  }
  return removed
}
