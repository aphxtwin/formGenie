'use client'
import Link from 'next/link'
import { Session } from "@/lib/types"
import { Puertita } from "@/components/ui/icons";
import { signOut } from '@/auth';
import { handleSignOut } from '@/lib/actions';
import { cn } from '@/lib/utils';


const authStyle = "bg-neutral-900 hover:bg-neutral-500 py-[7px] transition duration-300 ease-in-out text-white  rounded-lg font-semibold";
interface AuthButtonProps {
    session: Session
    className?: string
}

export const AuthButton: React.FC<AuthButtonProps> = ({className='', session})=> {
    if (session) {
        return (
            <form action={handleSignOut}>
                <button className={cn
                    (
                        authStyle, className || ''

                    )}>
                    Log Out
                </button>
            </form>

        )
    }
    
    return (
    <Link href={'/login'} className={cn
        (
            authStyle, className || ''

        )}>
        <span className='flex flex-inline items-center gap-x-2'><Puertita/>Log In</span>
    </Link>
  )
}