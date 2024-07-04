
import BuildYourForm from "@/components/build-your-form";
import {auth} from 'auth';
import { redirect } from "next/navigation";
import {Session} from "@/lib/types";

export default async function ChatPage() {
    const session = (await auth()) as Session

    if (!session?.user) {
        redirect(`/signup`)
    }

    return (
        <BuildYourForm session={session} />
    );
}