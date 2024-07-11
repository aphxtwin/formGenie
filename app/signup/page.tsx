import {auth} from '@/auth'
import SignUp from '@/components/signUpForm'
import { Session } from '@/lib/types'
import {redirect} from 'next/navigation'

export default async function SignUpPage() {

    const session = (await auth()) as Session
    console.log(session)
    if (session){
        console.log('session from sign up', session)
        redirect('/chat/a')
    }

    return (
        <div className='flex justify-center items-center h-screen'>
            <SignUp session={session}/>
        </div>
    )
}