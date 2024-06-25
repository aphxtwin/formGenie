"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { redirect, useRouter } from "next/navigation";

export default function SignUp() {
  const [email, setEmail] = useState<String>("");
  const [password, setPassword] = useState<String>("");
  const [userInput, setUserInput] = useState('');
  const router = useRouter();
  const inputFieldsStyle = 'border-[3px] border-black rounded-lg bg-inherit px-3 py-2 mt-3';
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  }

  useEffect(() => {
    // Retrieve the stored input value from localStorage
    const storedInput = localStorage.getItem('userInput');
    if (storedInput) {
      setUserInput(storedInput);
    }
  }, [])

  return (
    <div className="flex flex-col">
      <div className="flex flex-col text-center">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-semibold">
            
            {userInput ? <span>Create an account to finish your form.</span> : <span>Create an account to start building forms.</span>}
            </h1>
        </div>   
        <div className="w-full flex justify-center items-center pt-5">
          <div className="w-[80%]">
            <button className="px-11 py-[0.68rem] border-[3px] border-black rounded-lg mt-6">
              <div className="flex gap-x-3 items-center">
                <Image src='/google.svg' width={20} height={20} alt="google" />
                <span className="font-semibold">Continue with Google</span>
              </div>

            </button>

          </div>

        </div>
        <span className="py-6">or</span>
        <div className="w-full flex justify-center items-center">
          <form className="" onSubmit={handleSubmit}>
            <div className="flex flex-col pb-[1.5rem]">
            <input
                  type="email"
                  value={email}
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className={inputFieldsStyle}
                  required
                />
                <input
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className={inputFieldsStyle}
                  required
                />
            </div>

                <button className="bg-black px-[8.5rem] py-[0.8rem] font-semibold text-white rounded-full hover:bg-gray-800" type="submit">Sign in</button>
          </form>
        </div>
        <div className="flex justify-center items-center pt-6">
          <span className="pr-1">Already have an account?</span>
          <button onClick={()=>router.push("/signIn")} className="text-blue-500 font-bold underline">Sign In</button>
      </div>

    </div>
    </div>
  );
}