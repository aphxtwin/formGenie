'use client'

import React,{useEffect} from 'react';
import Textarea from 'react-textarea-autosize'
import { useActions, useUIState } from 'ai/rsc'
import { UserMessage } from './messages';
import { Button } from '@radix-ui/themes';
import { nanoid } from 'nanoid'

type PromptFormProps = {
  setFlashlight?: React.Dispatch<React.SetStateAction<boolean>>;
  setInput?: React.Dispatch<React.SetStateAction<string>>; // Add this line
  input: string;
  flashlight?: boolean;
  disabled?: boolean;
  isTheFirstMessage?: boolean;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void; // Corrected the type for handleSubmit
  handleInputChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; // Assuming handleInputChange is a function that takes a change event
};



export default function PromptForm({
  setFlashlight,
  flashlight=false,
  input,
  disabled=false,
  isTheFirstMessage=false,
  handleSubmit,
  handleInputChange,
}: PromptFormProps) {

  useEffect(() => {
    if (isTheFirstMessage) {
      if (input == '') {
        setFlashlight && setFlashlight(false);
      }
      else {
        setFlashlight && setFlashlight(true);
      }
    }
  }, [input, setFlashlight, flashlight, isTheFirstMessage])

  return (
    <div className='flex flex-col z-50'>
        {isTheFirstMessage && <div className={`bg-gradient-to-r  from-purple-400  to-pink-400 absolute w-[530px] h-[60px] p-10 rounded-full blur-xl`}></div>}
          <form 
            className={`flex`}
            onSubmit={handleSubmit}
            >
          <div className={`rounded-full w-[510px] z-50  flex items-center justify-center max-h-60  bg-neutral-900  grow flex-row overflow-hidden px-8   sm:px-12`}>
            <Textarea
              tabIndex={0}
              placeholder="Write your idea or purpose..."
              className="text-start text-md min-h-[60px]  w-full text-zinc-200 selection:bg-gray-200 selection:text-neutral-800 font-medium resize-none text-lg bg-transparent px-1 py-[1.3rem] focus-within:outline-none sm:text-sm"
              autoFocus
              disabled={disabled}
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              name="message"
              rows={1}
              value={input}
              onChange={handleInputChange}
              />
            {input && (<Button type="submit" className=" text-zinc-200 hover:bg-zinc-800 px-2 py-1 rounded ml-2  shadow-lg  ring-2 ring-zinc-300"><svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" className="css-i6dzq1"><polyline points="15 10 20 15 15 20"></polyline><path d="M4 4v7a4 4 0 0 0 4 4h12"></path></svg></Button>)}
            
          </div>
              
          </form>
    </div>
  )
}
