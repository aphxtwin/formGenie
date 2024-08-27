import { SessionProvider } from "next-auth/react";
import { AI } from "./actions";

export default async function ChatLayout({
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
