"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {toast} from 'sonner';
import { signUp } from "@/app/signup/actions";
import { redirect, useRouter } from "next/navigation";
import { useFormState,useFormStatus } from "react-dom";
import { getMessageFromCode } from "@/lib/utils";
import { IconSpinner } from "./ui/icons";
import { Session } from "@/lib/types";
// import { useActions } from "ai/rsc";

interface SignUpProps{
  session: Session
}

const SignUp: React.FC<SignUpProps> = ({session})=> {
  const router = useRouter();
  const [userInput, setUserInput] = useState<string>('')
  const [result,dispatch] = useFormState(signUp,undefined);

  const inputFieldsStyle = 'border-[3px] border-black rounded-lg bg-inherit px-3 py-2 mt-3';
  
  useEffect(() => {
    if (result) {
      if (result.type === 'error') {
        toast.error(getMessageFromCode(result.resultCode))
      } else if (result.type === 'success') {
        toast.success(getMessageFromCode(result.resultCode))
        router.refresh()
      }
    }
  }, [result, router])

  const storedInput = localStorage.getItem('prompt');

  useEffect(() => {
    // Retrieve the stored input value from localStorage
    
    if (storedInput && !session) {
      setUserInput(storedInput);
    }
  }, [storedInput, session])

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
                <span className="font-semibold">Sign Up with Google</span>
              </div>

            </button>

          </div>

        </div>
        <span className="py-6">or</span>
        <div className="w-full flex justify-center items-center">
          <form className="" action={dispatch}>
            <div className="flex flex-col pb-[1.5rem]">
            <input
                  type="email"
                  autoComplete="email"
                  name="email"
                  placeholder="Email"
                  className={inputFieldsStyle}
                  required
                />
                <input
                  type="password"
                  autoComplete="current-password"
                  name="password"
                  placeholder="Password"
                  className={inputFieldsStyle}
                  required
                />
            </div>
            <LoginButton/>
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
export default SignUp;

function LoginButton() {
  const {pending} = useFormStatus()

  return (
    <button 
      aria-disabled={pending} 
      className=" bg-black w-[14.3rem] h-[2.8rem] font-semibold text-white rounded-full hover:bg-gray-800" 
      type="submit"
      >
          {pending ? <IconSpinner className="w-full"/> : 'Create Account'}
      </button>

    )
}
