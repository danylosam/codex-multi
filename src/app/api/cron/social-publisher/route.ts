import { createServerClient } from '@supabase/ssr'
import { cleanupPublishedImages, publishSocialPost } from '@/lib/social/publisher'

export const runtime = 'nodejs'
export const maxDuration = 300

function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Configuração administrativa do Supabase ausente.')
  return createServerClient(url, key, { cookies: { getAll: () => [], setAll: () => {} } })
}

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  const now = new Date().toISOString()
  const { data: duePosts, error } = await supabase.from('social_posts').select('id,user_id')
    .eq('status', 'scheduled').lte('scheduled_at', now).order('scheduled_at').limit(10)
  if (error) return Response.json({ error: error.message }, { status: 500 })

  const results = []
  for (const post of duePosts ?? []) {
    try {
      const result = await publishSocialPost(supabase, post.id, post.user_id)
      results.push({ id: post.id, status: 'published', permalink: result.permalink })
    } catch (cause) {
      results.push({ id: post.id, status: 'failed', error: cause instanceof Error ? cause.message : 'Unknown error' })
    }
  }

  const cleaned = await cleanupPublishedImages(supabase).catch(() => 0)
  return Response.json({ processed: results.length, cleaned, results })
}
