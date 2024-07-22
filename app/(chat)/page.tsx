
import BuildYourForm from "@/components/build-your-form";
import {auth} from '@/auth';
import {Session} from "@/lib/types";
import {AuthButton} from "@/components/authButton";

export default async function ChatPage() {
    const session = (await auth()) as Session
    console.log(session, 'session from page')


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