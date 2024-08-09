import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import ChatPageClient from '@/components/chat';
import { Session } from '@/lib/types';
import {AI} from '../../actions';
import { loadBsFromDb } from '@/app/actions';

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

  const user = session.user;
  console.log(params.id)
  const chat = await loadBsFromDb(params.id, user?.id);
  console.log(chat)
  
  return (
    <AI >
      <ChatPageClient initialAIState={{chatId:chat?.id, user:user.id}} session={session} />
    </AI>
  )

  
};

export default ChatPage;