'use client'
import PromptForm from "@/components/prompt-form";
import { useEffect, useState } from "react";
import { useActions, useUIState } from "ai/rsc";
import type {AI} from '../../action';


const ChatPage = () => {
    const [input, setInput] = useState<string>("")
    const [messages, setMessages] = useUIState<typeof AI>();


    console.log(messages)
    const handleInputChange = (e:any) => {
        setInput(e.target.value)
    }
    const handleSubmission =  async (e:any) =>{
        e.preventDefault()
        const value = input.trim()
        console.log(value)
    }
    return (
        <div>
            <div className="grid grid-cols-2 gap-3 min-h-screen">
                <div className="p-5 col-span-1">
                    <div className="flex flex-col justify-betweenh-full">
                        <div className="space-y-3 h-[570px] overflow-y-scroll">
                        {
                            // View messages in UI state
                            messages.map((message) => (
                            <div key={message.id}>
                                {message.display}
                            </div>
                            ))
                        }

                        </div>
                        <div className="justify-items-end px-5">
                            <PromptForm isTheFirstMessage={false} input={input} handleInputChange={handleInputChange} handleSubmit={handleSubmission}/>
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