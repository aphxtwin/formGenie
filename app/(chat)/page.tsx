
import BuildYourForm from "@/components/build-your-form";
import {auth} from '@/auth';
import { redirect } from "next/navigation";
import {Session} from "@/lib/types";
import {AuthButton} from "@/components/authButton";

export default async function ChatPage() {
    const session = (await auth()) as Session

    return (
        <div className="min-h-screen">
            <div className="flex justify-end w-full p-3">
                <AuthButton session={session} />
            </div>
            <div className="flex items-center justify-center pt-[25vh]">
                <BuildYourForm session={session} /> 
            </div>
        </div>
    );
}