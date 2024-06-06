'use client'
import React, {useState, useEffect} from "react";
import PromptForm from "@/components/prompt-form";
import UserMessage from "@/components/messageUser";
import { useAIState, useActions, useUIState } from 'ai/rsc';
import { nanoid } from "@/lib/utils";
import { AI } from "../../action";

interface ComponentType {
  component: React.ComponentType;
}
const ChatPage = () => {
    const [input, setInput] = useState<string>("")
    const [_, setMessages] = useUIState<typeof AI>();
    const [loadedComponents, setLoadedComponents] = useState<ComponentType[]>([]);
    // const [componentVersions, setComponentVersions] = useState([]);
    const [messages] = useUIState();
    const [aiState] = useAIState();
    const [componentStream, setComponentStream] = useState<string>('');
  const [processing, setProcessing] = useState<boolean>(false);
    const {submitUserMessage} = useActions();



    const handleInputChange = (e:any) => {
        setInput(e.target.value)
    }

    const generateNewComponent = async (userDescription:any)=>{
      
      let receivedStream = ''
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
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader!.read();
        if (done) {
          break;
        }
        const text = decoder.decode(value); // Decode the received data as text
        receivedStream += text;
        setComponentStream(receivedStream.split('\n').slice(-5).join('\n') );
      }
      console.log('ESTE ES EL RESPONSE=>', response.body)
      console.log('ESTE ES EL STREAM=>', receivedStream)
      setProcessing(false);
      fetchComponents();

    }
    const fetchComponents = async () => {
      const response = await fetch(
        `http://localhost:3003/components/list?framework=react&components=shadcn&icons=lucide`
      );
      const data = await response.json();
      console.log('ESTA ES LA DATA=>', data);
      // setLoadedComponents([...Array(data.items.length).keys()].map(() => false));
      const imports = data.items.map(async (component:any) => {
        // Construct the import path for each child component
        
        try {
          // Use dynamic import to load the component, and catch any errors
          let myModule
          try {
            myModule = await import(`@/openv0/webapp/src/components/openv0_generated/${component.name}/${component.name}_${component.latest}.tsx`);
          } catch(e) {
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



      const handleSubmission =  async (e:any) =>{
          e.preventDefault()
          
          const userDescription = input.trim()
            if (!userDescription) return
          setInput('')
          // Add user message to UI state
          setMessages((currentMessages:any) => [
            ...currentMessages,
            {
              id: nanoid(),
              display: <UserMessage content={userDescription}/>
            }
          ])
          setProcessing(true);
          console.log(aiState.messages)
          generateNewComponent(aiState.messages.map((message:any) => message.content).join(' '))
          
        }
      useEffect(() => {
        fetchComponents()
      }, []);

    return (
        <div className="h-lvh">
        <div className="bg-neutral-900 border-b-2 border-zinc-600 h-[60px]"></div>

              <div className="grid grid-cols-2 gap-1">
                  
                  <div className="col-span-1 h-[90vh]">
                      <div className="flex relative flex-col overflow-y-scroll mx-2 my-1 h-[80vh]">
                      <div className="py-3 px-2">
                      {
                          messages.map((message:any) => (
                          <div key={message.id}>
                            {message.display}
                          </div>
                        ))
                      }
                      </div>
                              <div className="fixed left-9 bottom-6 ">
                                  <PromptForm className={`${input ? '' : 'h-[58px]' } mb-1 w-[600px]  max-h-[150px]`} isTheFirstMessage={false} input={input} handleInputChange={handleInputChange} handleSubmit={handleSubmission}/>
                              </div>
                      </div>
                  </div>

                  <div className="col-span-1 h-[90vh]">
                    <div className="flex flex-col justify-center items-center h-full">
                      <h1 className="text-4xl font-bold text-center flex pb-1 capitalize text-neutral-900">Preview your form</h1>
                      <div className='my-2'>
                        <div className={`${loadedComponents.length > 1 && 'overflow-y-scroll'} w-[510px] h-[77vh] bg-white rounded-3xl shadow-gray-900/50 shadow-2xl`} >
                          {
                            processing ? (
                              <p className="w-full h-full text-xl animate-pulse flex justify-center items-center">Processing...</p>
                            ) : (
                              loadedComponents.map((component, index) => {
                                return (
                                  <div className="" key={index}>
                                    {component.component  ? (
                                      <div className="">
                                        {component?.component && <component.component />}
                                      </div>
                                    ) : component && component.component === 'fail' ? (
                                      <p className="text-xs">could not import</p>
                                    ) : (
                                      <p className="text-xs">loading</p>
                                    )}
                                  </div>
                                );
                              })
                            )
                          }
                        </div>
                      </div>
                    </div>
                  </div>

                  </div>
              </div>



    );


};

export default ChatPage;

