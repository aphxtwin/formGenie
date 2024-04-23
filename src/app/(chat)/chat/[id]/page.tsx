'use client'
import PromptForm from "@/components/prompt-form";
import { useEffect, useState } from "react";
import { useActions, useUIState } from "ai/rsc";
import type {AI} from '../../action';
import UserMessage from "@/components/messageUser";


const ChatPage = () => {
    const [input, setInput] = useState<string>("")
    const [messages, setMessages] = useUIState<typeof AI>();
    const {submitUserMessage} = useActions();

    console.log(messages)
    const handleInputChange = (e:any) => {
        setInput(e.target.value)
    }

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
        } catch (error) {
            console.error(error)
        }
        
    }


    return (
        <div className="h-lvh overflow-y-hidden">
            <div className="grid grid-cols-2 gap-3">
                <div className="p-5 col-span-1">
                    <div className="flex flex-col">
                        <div className="space-y-3 overflow-y-scroll h-[600px] py-5 px-3">
                        {
                            // View messages in UI state
                            messages.map((message) => (
                            <div key={message.id}>
                                {message.display}
                            </div>
                            ))
                        }

                        </div>
                        <div className="fixed rigth-0 bottom-2">
                            <PromptForm className="w-[570px] max-h-[200px]" isTheFirstMessage={false} input={input} handleInputChange={handleInputChange} handleSubmit={handleSubmission}/>
                        </div>
                        
                    </div>
                </div>
                <div className="col-span-1 p-5">
                    <div className="flex  flex-col justify-center items-center h-full">
                        <h1 className="text-4xl font-semibold text-center flex">Preview your form</h1>
                        <div className='my-5'>
                            <div className='w-[400px] h-[500px] bg-white rounded-3xl shadow-gray-900/50 shadow-2xl'></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;