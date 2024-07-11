'use client'
import {useEffect} from 'react'
import {toast} from  'sonner'
import {authenticate} from '@/app/login/actions'
import { useFormState, useFormStatus } from 'react-dom'
import { useRouter, useSearchParams } from 'next/navigation';
import { IconSpinner } from './ui/icons';
import { getMessageFromCode } from '@/lib/utils';
import Image from 'next/image';
import { useLocalStorage } from '@/lib/hooks/useLocalStorage'


export default function LoginForm() {
  const router= useRouter()
  const searchPararms = useSearchParams()
  const chatId = searchPararms?.get('chatSessionId') || undefined;

  const [result,dispatch] = useFormState(authenticate,undefined);
  const [userInput, __] = useLocalStorage('prompt',{})
  const inputFieldsStyle = 'min-w-[18rem] border-[3px] border-black rounded-lg bg-inherit px-3 py-2 mt-3';

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

  return (
      <div className="flex flex-col">
        <div className="flex flex-col text-center">
          <div className="flex flex-col items-center">
            <h1 className="text-4xl font-semibold">
              {userInput ? <span>Your prompt is safe. Sign in to make it real</span> : <span>Log in to design and deploy forms.</span>}
            </h1>
          </div>   
          <div className="w-full flex justify-center items-center pt-5">
          <button className="px-11 py-[0.68rem] border-[3px] border-black rounded-lg mt-6">
                <div className="flex gap-x-3 items-center">
                  <Image src='/google.svg' width={20} height={20} alt="google" />
                  <span className="font-semibold">Continue with Google</span>
                </div>
  
          </button>
  
  
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
            <span className="pr-1">Don&#39;t have an account?</span>
            <button onClick={()=>router.push(chatId?`/signup?chatSessionId=${chatId}?`:'/signup')} className="text-blue-500 font-bold underline">Create account</button>
        </div>
  
      </div>
      </div>
    );
}

function LoginButton() {
  const {pending} = useFormStatus()

  return (
    <button 
      aria-disabled={pending} 
      className=" bg-black w-[14.3rem] h-[2.8rem] font-semibold text-white rounded-full hover:bg-gray-800" 
      type="submit"
      >
        {pending ? <IconSpinner className="w-full h-8"/> : 'Login'}
      </button>

    )
}

