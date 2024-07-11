import { auth } from '@/auth'
import LoginForm from '@/components/loginForm'
import { Session } from '@/lib/types'
import { redirect, useSearchParams } from 'next/navigation'

export default async function LoginPage({searchParams}: {searchParams: URLSearchParams}) {
  const session = (await auth()) as Session
  const chatId = searchParams

  if (session) {
    if (searchParams.has('chatSessionId')) {
      redirect(`/chat/${chatId}`)
    }
    redirect('/')  
  }

  return (
    <main className="flex flex-col p-4 justify-center items-center h-screen">
      <LoginForm session={session} />
    </main>
  )
}