"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div>
        {session.user?.name} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen flex text-white">
      <div className="flex flex-col gap-y-8 items-center w-screen justify-center">
        <h1 className="text-5xl font-medium">Forms has never been<br></br> so useful.</h1>
        <button className="border px-[9.5rem] py-[1rem] rounded-full hover:bg-gray-800" onClick={() => signIn()}>Sign in</button>
      </div>
    </div>
  );
}