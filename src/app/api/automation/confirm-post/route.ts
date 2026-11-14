import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  const authHeader = request.headers.get('x-automation-secret');
  if (!process.env.AUTOMATION_SECRET_KEY || authHeader !== process.env.AUTOMATION_SECRET_KEY) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const body = await request.json();
  const { post_id, status, image_url, error_message } = body;

  if (!post_id || !['published', 'failed'].includes(status)) {
    return NextResponse.json({ error: 'Payload inválido' }, { status: 400 });
  }

  const updateData: Record<string, unknown> = {
    status,
    image_url: image_url || null,
    error_message: error_message || null,
  };

  if (status === 'published') {
    updateData.published_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from('social_posts_queue')
    .update(updateData)
    .eq('id', post_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, post_id, status });
}
