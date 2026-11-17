'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { generateSherpaReply } from '@/lib/ai/sherpa-service'

const bucket = 'social-assets'
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
  const visualPrompt = String(formData.get('prompt_image') ?? '').trim()
  const scheduledInput = String(formData.get('scheduled_at') ?? '').trim()
  const scheduleRequired = formData.get('schedule_required') === 'true'
  const file = formData.get('image')

  if (!caption) return { error: 'Escreva uma legenda antes de continuar.' }
  if (!['instagram', 'facebook'].includes(platform)) return { error: 'Canal de publicação inválido.' }
  if (scheduleRequired && !scheduledInput) return { error: 'Escolha quando a publicação deve ser agendada.' }

  const hasFile = file instanceof File && file.size > 0
  if (!hasFile && !visualPrompt) {
    return { error: 'Informe um briefing visual para a IA gerar a imagem ou selecione um arquivo.' }
  }

  let scheduledFor = new Date().toISOString()
  if (scheduledInput) {
    const date = new Date(scheduledInput)
    if (!Number.isFinite(date.getTime()) || date.getTime() <= Date.now()) {
      return { error: 'Escolha uma data futura para o agendamento.' }
    }
    scheduledFor = date.toISOString()
  }

  const postId = crypto.randomUUID()
  let imageUrl: string | null = null

  if (hasFile) {
    if (!allowedTypes.has(file.type) || file.size > maxImageSize) {
      return { error: 'Use JPG, PNG ou WebP com até 10 MB.' }
    }
    const extension = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg'
    const path = `${postId}.${extension}`
    const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, { contentType: file.type, upsert: true })
    if (uploadError) return { error: `Falha ao armazenar a imagem: ${uploadError.message}` }
    const { data: publicUrl } = supabase.storage.from(bucket).getPublicUrl(path)
    imageUrl = publicUrl.publicUrl
  }

  const { error: insertError } = await supabase.from('social_posts_queue').insert({
    id: postId,
    user_id: user.id,
    platform,
    visual_prompt: visualPrompt || 'Editorial modern minimalist visual matching caption',
    caption,
    image_url: imageUrl,
    scheduled_for: scheduledFor,
    status: 'pending',
  })

  if (insertError) {
    if (imageUrl) await supabase.storage.from(bucket).remove([`${postId}.png`, `${postId}.jpg`, `${postId}.webp`])
    return { error: `Falha ao salvar o post na fila: ${insertError.message}` }
  }

  revalidatePath('/workspace/publisher')
  return { success: true }
}

export async function publishPostNow(postId: string) {
  const { supabase, user } = await getUser()
  const { error } = await supabase
    .from('social_posts_queue')
    .update({ status: 'pending', scheduled_for: new Date().toISOString() })
    .eq('id', postId)
    .or(`user_id.eq.${user.id},user_id.is.null`)
  if (error) return { error: error.message }
  revalidatePath('/workspace/publisher')
  return { success: true }
}

export async function updatePostCaption(postId: string, caption: string) {
  const { supabase, user } = await getUser()
  const cleanCaption = caption.trim()
  if (!cleanCaption) return { error: 'A legenda não pode ficar vazia.' }
  const { error } = await supabase
    .from('social_posts_queue')
    .update({ caption: cleanCaption })
    .eq('id', postId)
    .or(`user_id.eq.${user.id},user_id.is.null`)
    .in('status', ['pending', 'failed'])
  if (error) return { error: error.message }
  revalidatePath('/workspace/publisher')
  return { success: true }
}

export async function deleteSocialPost(postId: string) {
  const { supabase, user } = await getUser()
  const { error } = await supabase
    .from('social_posts_queue')
    .delete()
    .eq('id', postId)
    .or(`user_id.eq.${user.id},user_id.is.null`)
  if (error) return { error: error.message }
  revalidatePath('/workspace/publisher')
  return { success: true }
}