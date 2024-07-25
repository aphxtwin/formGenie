'use server'

import { signOut } from '@/auth'
import { redirect } from 'next/navigation'

export async function handleSignOut() {
  const out = await signOut({ redirect: true, redirectTo: '/' })
  out && redirect('/login');
}