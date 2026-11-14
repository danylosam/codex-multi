import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  const authHeader = request.headers.get('x-automation-secret');
  if (!process.env.AUTOMATION_SECRET_KEY || authHeader !== process.env.AUTOMATION_SECRET_KEY) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: nextPost, error } = await supabase
    .from('social_posts_queue')
    .select('*')
    .eq('status', 'pending')
    .lte('scheduled_for', new Date().toISOString())
    .order('scheduled_for', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!nextPost) {
    return NextResponse.json({ has_post: false, message: 'Nenhum post pendente para este horário' }, { status: 200 });
  }

  await supabase
    .from('social_posts_queue')
    .update({ status: 'processing' })
    .eq('id', nextPost.id);

  return NextResponse.json({
    has_post: true,
    post_id: nextPost.id,
    platform: nextPost.platform,
    caption: nextPost.caption,
    visual_prompt: nextPost.visual_prompt,
  });
}
