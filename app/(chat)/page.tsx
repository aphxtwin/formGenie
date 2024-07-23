
import {auth} from '@/auth';
import {Session} from "@/lib/types";
import MainPage from "@/components/mainPage";
import {signOut} from '@/auth';

export default async function ChatPage() {
    const session = (await auth()) as Session
    const signOutAction = async ()=>{
        'use server'
        await signOut({redirect:true, redirectTo:'/'})    
    }

    return (
        <MainPage signOut={signOutAction} session={session}/>
    );
}