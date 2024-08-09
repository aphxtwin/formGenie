/*
    This is the entry point for building a new form.
*/
'use client';
import React, { useState, useEffect } from 'react';
import PromptForm from "./prompt-form";
import FlashlightOverlay from './ui/flashlightOverlay';
import { useUIState, useActions } from 'ai/rsc';
import {useChat} from 'ai/react';
import UserMessage from './messageUser';
import { nanoid } from '@/lib/utils';
import type {AI} from '../app/(chat)/actions';
import { useRouter } from 'next/navigation';
import { Session } from '@/lib/types';
import { useLocalStorage } from '@/lib/hooks/useLocalStorage';


interface BuildYourFormProps {
    session: Session
}

const examples = {
    "example1": "Create a short online job application form for part-time barista and cashier roles.",
    "example2": "Build a contact form for a website with name, email, and message fields.",
    "example3": "Design a survey form to collect feedback on customer satisfaction.",
};

const ExamplesShowcase = ({ descriptionExample, setInput, input}: { descriptionExample: string, setInput: any, input:string }) => {
    return (
        <button 
            onClick={()=> setInput(descriptionExample)} 
            className={`${input !== '' ? 'bg-neutral-500': 'bg-zinc-200'} w-[350px] z-40 hover:bg-zinc-300 h-[93px] p-2 flex flex-row   rounded text-zinc-700 px-3`}
        >
            <span className="wrap">{descriptionExample}</span>
            <svg className="w-[60px]" width="15" height="15" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M3.64645 11.3536C3.45118 11.1583 3.45118 10.8417 3.64645 10.6465L10.2929 4L6 4C5.72386 4 5.5 3.77614 5.5 3.5C5.5 3.22386 5.72386 3 6 3L11.5 3C11.6326 3 11.7598 3.05268 11.8536 3.14645C11.9473 3.24022 12 3.36739 12 3.5L12 9.00001C12 9.27615 11.7761 9.50001 11.5 9.50001C11.2239 9.50001 11 9.27615 11 9.00001V4.70711L4.35355 11.3536C4.15829 11.5488 3.84171 11.5488 3.64645 11.3536Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                ></path>
            </svg>
        </button>
    );
};

const BuildYourForm: React.FC<BuildYourFormProps> = ({session}) => {
    const {input,handleInputChange, setInput} = useChat()
    const [_, setMessages] = useUIState<typeof AI>();
    const [disabled, setDisabled] = useState(false);
    const router = useRouter();
    const {submitUserMessage} = useActions();
    interface StoredInput {
        prompt?: string;
        buildSessionId?: string;
    }
    
    const [storedInput, setStoredInput] = useLocalStorage<StoredInput>('prompt',{})

    const [flashlight, setFlashlight] = useState(false)


    const handleSubmission =  async (e:any) =>{
        e.preventDefault()
        
        const value = input.trim()
        if (!value) return
        setInput('')
        

        // Add user message to UI state
        setMessages(currentMessages => [
            ...currentMessages,
            {
              id: nanoid(),
              display: <UserMessage content={value}/>
            }
          ])
        // Submit and get response message
        if(value){
            try{
                const responseMessage = await submitUserMessage({ 
                    content:value,
                    currentBuildSession:storedInput? storedInput.buildSessionId : null,
                    generationRequest:false 
                    })
            
                if (responseMessage) {
                    const buildSessionId = responseMessage.buildSession
                    if(responseMessage.type === 'session') {
                        // No session but saves the prompt and generates a buildSessionId
                        setStoredInput({prompt:value,buildSessionId})
                        router.push(`/login?chatSessionId=${buildSessionId}`)
                    } else {
                        setMessages(currentMessages => [...currentMessages, responseMessage])
                        buildSessionId && setStoredInput({prompt:value,buildSessionId})
                        router.push(`/chat/${buildSessionId}`)
                    }

                } else {
                    console.log('no response message because error')
                }
            } catch(e){
                console.error(e)
            }
        } else {
            console.error('no value or buildSessionId')
        }



    }

    
    // useEffect(() => {
    //     if (storedInput) {
    //         setDisabled(true)
    //         router.push(`/chat/${storedInput}`)
    //     }
    // },[storedInput, router])

    return (
        <div className={`flex flex-col items-center`}>
           <FlashlightOverlay isVisible={flashlight} />
            <div className="text-center space-y-8">
                <h1 className="text-6xl font-semibold tracking-tight from-blue to-red-500">Build Your Form</h1>
                <PromptForm 
                    setFlashlight={setFlashlight} 
                    setInput={setInput}
                    disabled={disabled} 
                    isTheFirstMessage={true}
                    handleInputChange={handleInputChange} 
                    handleSubmit={handleSubmission} 
                    className='w-[530px] h-[4rem]'
                    input={input} 
                    flashlight={flashlight}/>
            </div>
            <div className=''>
                <div className="absolute bottom-20  inset-x-16">
                    <div className={`flex items-center justify-center space-x-3`}>
                    {Object.keys(examples).map((key) => (
                        <ExamplesShowcase 
                            input={input} 
                            setInput={setInput} 
                            descriptionExample={examples[key as keyof typeof examples]} 
                            key={key} 
                        />
                    ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default BuildYourForm;