import Link from 'next/link'
import { Session } from "@/lib/types"
import { Puertita } from "@/components/ui/icons";
import { signOut } from '@/auth';

const authStyle = "bg-neutral-900 hover:bg-neutral-500 py-[7px] transition duration-300 ease-in-out text-white px-5 rounded-lg font-semibold";
interface AuthButtonProps {
    session: Session
}

export const AuthButton: React.FC<AuthButtonProps> = ({session})=> {
    if (session) {
        return (
            <form action={async ()=>{
                'use server'
                await signOut()
            }}>
                <button className={authStyle}>
                    Log Out
                </button>
            </form>

        )
    }
    
    return (
    <Link href={'/login'} className={authStyle}>
        <span className='flex flex-inline items-center gap-x-2'><Puertita/>Log In</span>
    </Link>
  )
}