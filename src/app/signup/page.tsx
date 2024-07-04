import {auth} from 'auth'
import SignUp from '@/components/signUpForm'
import { Session } from '@/lib/types'
import {redirect} from 'next/navigation'

export default async function SignUpPage() {
    const session = (await auth) as Session
    if (session){
        redirect('/')
    }

    return (
        <div className='flex justify-center items-center h-screen'>
            <SignUp/>
        </div>
    )
}