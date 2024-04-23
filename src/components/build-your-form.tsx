/*
    This is the entry point for building a new form.
*/
'use client';
import React, { useState, useEffect, use } from 'react';
import PromptForm from "./prompt-form";
import FlashlightOverlay from './ui/flashlightOverlay';
import { useUIState, useActions } from 'ai/rsc';
import {useChat} from 'ai/react';
import UserMessage from './messageUser';
import { nanoid } from '@/lib/utils';
import type {AI} from '../app/(chat)/action';
import { redirect } from 'next/navigation';
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

const BuildYourForm: React.FC = () => {
    const {input,handleInputChange, setInput} = useChat()
    const [_, setMessages] = useUIState<typeof AI>();
    const [ chatSessionId, setChatSessionId ] = useState<string | null>(null);
    const [disabled, setDisabled] = useState(false);
    const {submitUserMessage} = useActions();
    const [buildingSession, setBuildingSession] = useState(false)

    const [flashlight, setFlashlight] = useState(false)
    // console.log(messages)

    //This creates an unique nanoId to identify each chat
    useEffect(() => {
        const newChatSessionId = nanoid();
        setChatSessionId(newChatSessionId);

    },[])

    useEffect(() => {
        if (buildingSession) {
            setDisabled(true)
            redirect(`/chat/${chatSessionId}`)

        }
    },[buildingSession, chatSessionId])

    const handleSubmission =  async (e:any) =>{
        e.preventDefault()
        
        const value = input.trim()
        if (!value) return
        setInput('')
        // Add user message to UI state
        setMessages((currentMessages) => [
            ...currentMessages,
            {
                id: Date.now(),
                display: <UserMessage content={input} />,
            },
        ]);
        try {
        const res = await submitUserMessage(value)
           setMessages((currentMessages) => [
            ...currentMessages,
            res,
          ]);
           if (res) {
                setBuildingSession(true)
            }
        } catch (error) {
            console.error(error)
        }
        
    }

    return (
        <div className={`flex flex-col items-center justify-center min-h-screen`}>
           <FlashlightOverlay isVisible={flashlight} />
            <div className="text-center space-y-10">
                <h1 className="text-7xl">Build Your Form</h1>
                <PromptForm 
                    setFlashlight={setFlashlight} 
                    setInput={setInput}
                    disabled={disabled} 
                    isTheFirstMessage={true}
                    handleInputChange={handleInputChange} 
                    handleSubmit={handleSubmission} 
                    className='w-[515px] max-h-[200px]'
                    input={input} 
                    flashlight={flashlight}/>
            </div>
            <div>
                <div className="absolute bottom-[4rem] inset-x-16">
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