import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import ChatPageClient from '@/components/chat';
import { Session } from '@/lib/types';
import {AI} from '../../actions';
import { loadBsFromDb } from '@/app/actions';
import { getMessagesFromBuildSession } from '@/app/actions';
export interface ChatPageProps {
  params: {
    id: string
  }
}

const ChatPage = async ({params}:ChatPageProps ) => {

  const session = (await auth()) as Session
  
  if (!session?.user) {
    console.log('no session')
    redirect(`/login`);
  }

  
  const messages = await getMessagesFromBuildSession(params.id)
  return (
    <AI initialAIState={{buildSessionId: params.id, messages:messages}}>
      <ChatPageClient session={session} />
    </AI>
  )

  
};

export default ChatPage;