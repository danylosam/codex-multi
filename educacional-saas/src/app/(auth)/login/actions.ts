'use server'

import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

export async function signInWithPassword(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) return { error: error.message }
  return { success: true }
}

export async function sendSignInCode(email: string) {
  const supabase = await createClient()
  const origin = (await headers()).get('origin')

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) return { error: error.message }
  return { success: true }
}

export async function verifySignInCode(email: string, token: string) {
  const supabase = await createClient()

  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  })

  if (error) return { error: error.message }
  return { success: true }
}
