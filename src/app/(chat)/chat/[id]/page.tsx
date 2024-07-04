import { auth } from 'auth';
import { redirect } from 'next/navigation';
import ChatPageClient from '@/components/chat';
import { Session } from '@/lib/types';

const ChatPage = async () => {
  const session = (await auth) as Session;

  if (!session?.user) {
    redirect(`/signup`);
  }

  return <ChatPageClient session={session} />;
};

export default ChatPage;