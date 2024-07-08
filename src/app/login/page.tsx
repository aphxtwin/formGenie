import {auth} from 'auth'
import {  signIn } from 'next-auth/react'
import LoginForm from '@/components/loginForm'
import { Session } from '@/lib/types'
import { redirect } from 'next/navigation'

export default async function LoginPage() {
  const session = (await auth()) as Session
  if (session) {
    redirect('/chat/a')
  }

  return (
    <main className="flex flex-col p-4 justify-center items-center h-screen">
      <LoginForm />
    </main>
  )
}