import Link from 'next/link'
import {auth} from '@/auth'
import { Session } from "@/lib/types"
import React from "react"
const authStyle = "bg-black hover:bg-slate-700 text-white px-10 rounded-lg text-lg font-semibold"
interface AuthButtonProps {
    session: Session
}

export const AuthButton: React.FC<AuthButtonProps> = async ({session})=> {
    if (session) {
        return (
            <Link className={authStyle} variant="secondary" size="lg">
                Log Out
            </Link>
        )
    }
    return (
    <Link href={'/'} className={authStyle} variant="secondary" size="lg">
        Log In
    </Link>
  )
}