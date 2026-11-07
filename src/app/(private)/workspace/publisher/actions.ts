'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { publishSocialPost } from '@/lib/social/publisher'
import { generateSherpaReply } from '@/lib/ai/sherpa-service'

const bucket = 'instagram-temp'
const maxImageSize = 10 * 1024 * 1024
const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])

async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Sessão expirada. Entre novamente.')
  return { supabase, user }
}

export async function generateSocialCaption(briefing: string) {
  await getUser()
  const cleanBriefing = briefing.trim().slice(0, 2500)
  if (cleanBriefing.length < 12) return { error: 'Descreva o produto, o público e o objetivo da publicação.' }
  const result = await generateSherpaReply('social-copywriter', [{ role: 'user', content: cleanBriefing }])
  if ('error' in result) return { error: result.error }
  return { caption: result.reply }
}

export async function createSocialPost(formData: FormData) {
  const { supabase, user } = await getUser()
  const caption = String(formData.get('caption') ?? '').trim()
  const platform = String(formData.get('platform') ?? 'instagram')
  const promptImage = String(formData.get('prompt_image') ?? '').trim()
  const scheduledInput = String(formData.get('scheduled_at') ?? '').trim()
  const scheduleRequired = formData.get('schedule_required') === 'true'
  const file = formData.get('image')
  if (!caption) return { error: 'Escreva uma legenda antes de continuar.' }
  if (!(file instanceof File) || !file.size) return { error: 'Selecione uma imagem para o post.' }
  if (!allowedTypes.has(file.type) || file.size > maxImageSize) return { error: 'Use JPG, PNG ou WebP com até 10 MB.' }
  if (platform === 'instagram' && file.type !== 'image/jpeg') return { error: 'A publicação de imagem no Instagram exige arquivo JPEG.' }
  if (!['instagram', 'facebook'].includes(platform)) return { error: 'Canal de publicação inválido.' }
  if (scheduleRequired && !scheduledInput) return { error: 'Escolha quando a publicação deve ser agendada.' }

  let scheduledAt: string | null = null
  if (scheduledInput) {
    const date = new Date(scheduledInput)
    if (!Number.isFinite(date.getTime()) || date.getTime() <= Date.now()) return { error: 'Escolha uma data futura para o agendamento.' }
    scheduledAt = date.toISOString()
  }

  const postId = crypto.randomUUID()
  const extension = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg'
  const path = `${user.id}/${postId}.${extension}`
  const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, { contentType: file.type, upsert: false })
  if (uploadError) return { error: `Falha ao armazenar a imagem: ${uploadError.message}` }

  const { data: publicUrl } = supabase.storage.from(bucket).getPublicUrl(path)
  const { error: insertError } = await supabase.from('social_posts').insert({
    id: postId, user_id: user.id, platform, prompt_image: promptImage || null,
    caption, temp_storage_path: path, public_image_url: publicUrl.publicUrl,
    scheduled_at: scheduledAt, status: scheduledAt ? 'scheduled' : 'draft',
  })
  if (insertError) {
    await supabase.storage.from(bucket).remove([path])
    return { error: `Falha ao salvar o post: ${insertError.message}` }
  }
  revalidatePath('/workspace/publisher')
  return { success: true }
}

export async function publishPostNow(postId: string) {
  const { supabase, user } = await getUser()
  try {
    const result = await publishSocialPost(supabase, postId, user.id)
    revalidatePath('/workspace/publisher')
    return { success: true, permalink: result.permalink }
  } catch (error) {
    revalidatePath('/workspace/publisher')
    return { error: error instanceof Error ? error.message : 'Não foi possível publicar.' }
  }
}

export async function updatePostCaption(postId: string, caption: string) {
  const { supabase, user } = await getUser()
  const cleanCaption = caption.trim()
  if (!cleanCaption) return { error: 'A legenda não pode ficar vazia.' }
  const { error } = await supabase.from('social_posts').update({ caption: cleanCaption }).eq('id', postId).eq('user_id', user.id).in('status', ['draft', 'scheduled', 'failed'])
  if (error) return { error: error.message }
  revalidatePath('/workspace/publisher')
  return { success: true }
}

export async function deleteSocialPost(postId: string) {
  const { supabase, user } = await getUser()
  const { data: post, error: loadError } = await supabase.from('social_posts').select('temp_storage_path,status').eq('id', postId).eq('user_id', user.id).single()
  if (loadError || !post) return { error: 'Post não encontrado.' }
  if (post.status === 'publishing' || post.status === 'published') return { error: 'Posts em publicação ou já publicados não podem ser removidos da fila.' }
  if (post.temp_storage_path) {
    const { error: removeError } = await supabase.storage.from(bucket).remove([post.temp_storage_path])
    if (removeError) return { error: `A imagem não foi removida: ${removeError.message}` }
  }
  const { error } = await supabase.from('social_posts').delete().eq('id', postId).eq('user_id', user.id)
  if (error) return { error: error.message }
  revalidatePath('/workspace/publisher')
  return { success: true }
}
