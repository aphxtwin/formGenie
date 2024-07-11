
import BuildYourForm from "@/components/build-your-form";
import {auth, signOut} from '@/auth';
import { redirect } from "next/navigation";
import {Session} from "@/lib/types";
import {AuthButton} from "@/components/authButton";

export default async function ChatPage() {
    const session = (await auth()) as Session
    console.log(session, 'session from page')

    // if (!session?.user) {
    //     console.log('no session.user in chat page')
    //     redirect(`/login`);
    // }
    return (
        <div className="grid grid-rows-[1fr_3fr] min-h-screen">
            <div>
                <div className="flex justify-end w-full p-3"><AuthButton session={session} /></div>
            </div>
            <div className="flex justify-center pt-[5rem]">
                <BuildYourForm session={session} /> 
            </div>
        </div>
    );
}