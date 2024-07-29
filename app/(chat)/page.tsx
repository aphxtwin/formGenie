
import {auth} from '@/auth';
import {Session} from "@/lib/types";
import MainPage from "@/components/mainPage";
import {signOut} from '@/auth';
import { getAllBuildSessionsFromUser } from '../actions';

export default async function ChatPage() {
    const session = (await auth()) as Session


    const buildSessions = await getAllBuildSessionsFromUser(session.user.id, {select:{id:true}});

    return (
        <MainPage buildSessions={buildSessions} session={session} />
    );
}