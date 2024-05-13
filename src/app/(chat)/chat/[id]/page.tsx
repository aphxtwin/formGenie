'use client'
import React from "react";
import { Suspense } from "react";
import PromptForm from "@/components/prompt-form";
import { useEffect, useState } from "react";
import { useActions, useUIState } from "ai/rsc";
import type {AI} from '../../action';
import UserMessage from "@/components/messageUser";
import { useParams } from 'next/navigation';
interface ComponentType {
  component: React.ComponentType;
}
const ChatPage = () => {
    const [input, setInput] = useState<string>("")
    const [messages, setMessages] = useUIState<typeof AI>();
    // const {submitUserMessage} = useActions();
    const libRelativePath = `@/openv0/webapp/src/components/openv0_generated`;

    const [generateMode, setGenerateMode] = useState('description');
    const [openv0ComponentsList, setOpenv0ComponentsList] = useState([]);
    const [loadedComponents, setLoadedComponents] = useState<ComponentType[]>([]);
    const [processing, setProcessing] = useState(false);
    const [componentStream, setComponentStream] = useState<string>('');

    // const [componentVersions, setComponentVersions] = useState([]);
  
    const params = useParams<{ id: string }>();
    const chatId = params.id;

    const handleInputChange = (e:any) => {
        setInput(e.target.value)
    }

    // const handleSubmission =  async (e:any) =>{
    //     e.preventDefault()
        
    //     const value = input.trim()
    //     if (!value) return
    //     setInput('')
    //     // Add user message to UI state
    //     setMessages((currentMessages) => [
    //         ...currentMessages,
    //         {
    //             id: Date.now(),
    //             display: <UserMessage content={input} />,
    //         },
    //     ]);
    //     try {
    //     const res = await submitUserMessage(value)
    //        setMessages((currentMessages) => [
    //         ...currentMessages,
    //         res,
    //       ]);
    //     } catch (error) {
    //         console.error(error)
    //     }
        
    // }

    const fetchComponents = async () => {
      const response = await fetch(
        `http://localhost:3003/components/list?framework=react&components=shadcn&icons=lucide`
      );
      const data = await response.json();
      console.log('ESTA ES LA DATA=>', data);
      setOpenv0ComponentsList(data.items);
      setLoadedComponents([...Array(data.items.length).keys()].map(e => false));
      const imports = data.items.map(async (component) => {
        // Construct the import path for each child component
        
        try {
          // Use dynamic import to load the component, and catch any errors
          let myModule
          try {
            
            myModule = await import(`@/openv0/webapp/src/components/openv0_generated/${component.name}/${component.name}_${component.latest}.tsx`);
            console.log(myModule, 'myModule')
          } catch(e) {
            console.error('there;s a motherfucking problem with the import',e)
            return false
          }
          return {
            name: component.name,
            versions: component.versions,
            latest: component.latest,
            component: myModule.default,
          };
        } catch (error) {
          console.error(error);
          return false
        }
      });
  
      Promise.all(imports).then((components) => {
        setLoadedComponents(components.filter(e=>e));
      });
  
    };

    const generateNewComponent = async (userDescription:any)=>{
      if (processing) return;
      if (!userDescription) return;
      setProcessing(true);
      setComponentStream('');
      
      let receivedStream = ''

      console.dir({
        framework: 'react',
        components: 'shadcn',
        icons:'lucide',
        description: userDescription,
      })
      const response = await fetch(
        `http://localhost:3003/components/new/description` ,
        {
          method: "POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body : JSON.stringify({
            framework : `react`,
            components: `shadcn`,
            icons: `lucide`,
            description: userDescription,
            json: false,
          }),
        },
      );
      if (!response.ok){
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log(response.body,'***response.body')
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader!.read();
        if (done) {
          break;
        }
        const text = decoder.decode(value); // Decode the received data as text
        receivedStream += text;
        setComponentStream( receivedStream.split('\n').slice(-5).join('\n') );
      }
      console.log(receivedStream)
      setProcessing(false);
      try{
        const data = await fetchComponents();
        console.log(data, 'Componentes fetcheados')
      } catch (error) {
        console.error(error)
      }
      fetchComponents();

    }

    useEffect(() => {
      fetchComponents()
    }, []);

    const handleSubmission =  async (e:any) =>{
        e.preventDefault()
        
        const userDescription = input.trim()
        if (!userDescription) return
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
          generateNewComponent(userDescription)
        } catch (error) {
            console.error(error)
        }

    }


    return (
        <div className="h-lvh">
        <div className="bg-neutral-900 border-b-2 border-zinc-600 h-[60px]"></div>

              <div className="grid grid-cols-2 gap-1">
                  
                  <div className="col-span-1">
                      <div className="flex relative flex-col overflow-y-scroll mx-2 my-1 h-[520px]">
                    
                              {
                                  // View messages in UI state
                                  messages.map((message) => (
                                  <div key={message.id}>
                                      {message.display}
                                  </div>
                                  ))
                              }

                              <div className="fixed left-9 bottom-6 ">
                                  <PromptForm className={`${input ? '' : 'h-[58px]' } mb-1 w-[600px]  max-h-[150px]`} isTheFirstMessage={false} input={input} handleInputChange={handleInputChange} handleSubmit={handleSubmission}/>
                              </div>
                      </div>
                  </div>

                  <div className="col-span-1">
                    <div className="flex flex-col justify-center items-center h-full">
                      <h1 className="text-4xl font-bold text-center flex pt-2 pb-1 capitalize text-neutral-900">Preview your form</h1>
                      <div className='my-2'>
                        <div className='w-[500px] h-[520px] bg-white rounded-3xl shadow-gray-900/50 shadow-2xl'>
                        <div className=""></div>
                          
                          {loadedComponents.map((component, index) => (
                            <div className="" key={index}>
                              {component && component.component !== 'fail' ? (
                                <div className="overflow-y-scroll">
                                  <component.component  />
                                </div>
                              ) : component && component.component === 'fail' ? (
                                <p className="text-xs">could not import</p>
                              ) : (
                                <p className="text-xs">loading</p>
                              )}
                              
                            </div>
                          ))}

                        </div>
                      </div>
                    </div>
                  </div>

                  </div>
              </div>



    );


};

export default ChatPage;

