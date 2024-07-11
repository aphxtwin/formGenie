import {AI} from './actions';
export default function ChatLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <AI>
        {children}
      </AI>
    );
  }
