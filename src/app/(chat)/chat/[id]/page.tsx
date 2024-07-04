import { auth } from 'auth';
import { redirect } from 'next/navigation';
import ChatPageClient from '@/components/chat';

const ChatPage = async () => {
  const session = (await auth) as Session;

  if (!session?.user) {
    redirect(`/signup`);
  }

  return <ChatPageClient />;
};

export default ChatPage;