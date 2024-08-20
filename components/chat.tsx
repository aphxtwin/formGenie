'use client';

import React, {useState, useEffect} from "react";
import PromptForm from "@/components/prompt-form";
import UserResponse from "@/components/messageUser";
import { useAIState, useActions, useUIState } from 'ai/rsc';
import { nanoid } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
interface ComponentType {
  component: React.ComponentType;
}

const ChatPageClient = ({session}:any) => {
    const [input, setInput] = useState<string>("")
    const [loadedComponents, setLoadedComponents] = useState<ComponentType[]>([]);
    // const [componentVersions, setComponentVersions] = useState([]);
    const [messages] = useUIState();
    const [aiState] = useAIState();
    const [_, setMessages] = useUIState<typeof AI>();
    const [processing, setProcessing] = useState<boolean>(false);
    const {submitUserMessage, generateNewComponent} = useActions();
    const searchParams = useSearchParams()
    const router = useRouter()
    const containsChatSessionId = searchParams.get('chatSessionId')
    // const prompt = JSON.parse(window.localStorage.getItem('prompt') || '')

    const handleInputChange = (e:any) => {
        setInput(e.target.value)
    }

    const fetchComponents = async () => {
      const response = await fetch(
        `http://localhost:3003/components/list?framework=react&components=shadcn&icons=lucide`
      );
      const data = await response.json();
      setLoadedComponents([...Array(data.items.length).keys()].map(e => false));
      const imports = data.items.map(async (component) => {
      // Construct the import path for each child component
        
        try {
          // Use dynamic import to load the component, and catch any errors
          let myModule
          try {
            // If we want microservices we need to change this
            // this gets components from this same repo.            
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
        setLoadedComponents(components);
      });
  
    };


    useEffect(() => {
      fetchComponents()
    }, []);

    useEffect(() => {
      if(session?.user){
        if(containsChatSessionId){
          window.history.replaceState({},'',`/chat/${searchParams.get('chatSessionId')}`)
          router.refresh()
        }
      }
    }
    ,[session, searchParams])

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
          display: <UserResponse content={userDescription}/>
        }
      ])
      setProcessing(true);
      // we could set the bsession active here!!
      const res = await submitUserMessage({
        content: userDescription,
        currentBuildSession: prompt.buildSessionId,
        generationRequest: true
      });
      if (res) {
        fetchComponents();
        setProcessing(false);
      }

    }





    return (
        <div className="max-h-screen">
        <div className="bg-neutral-900 border-b-2 border-zinc-600 h-[60px]"></div>

              <div className="flex flex-col md:grid grid-cols-2 gap-1 space-y-10">
                  
                  <div className="col-span-1 h-[61vh] md:h-[90vh]">
                      <div className="flex relative flex-col overflow-y-scroll mx-2 my-1 h-full md:h-[80vh]">
                      <div className="h-full py-3 px-2 space-y-5">
                      {
                          messages.map((message:any) => (
                          <div key={message.id}>
                            {message.display}
                          </div>
                        ))
                      }
                      
                      </div>
                              <div className="flex justify-center  md:fixed left-9 bottom-6">
                                  <PromptForm className={`${input ? '' : 'h-[58px]' } mb-1 w-[85vw] md:w-[600px]  max-h-[150px] px-5`} isTheFirstMessage={false} input={input} handleInputChange={handleInputChange} handleSubmit={handleSubmission}/>
                              </div>
                      </div>
                  </div>

                  <div className="col-span-1 h-[50vh] md:h-[80vh]">
                    <div className="flex flex-col justify-center items-center h-full">
                      <h1 className="text-4xl font-bold text-center flex pt-2 pb-1 capitalize text-neutral-900">Preview your form</h1>
                      <div className='my-2'>
                        <div className='flex flex-col items-center justify-center overflow-y-hidden w-[80vw] md:w-[510px] h-[40vh] md:h-[77vh] bg-white rounded-3xl shadow-gray-900/50 shadow-2xl'>
                          
                          {loadedComponents.map((component, index) => (
                            <div className="w-full" key={index}>
                              {component && component.component !== 'fail' ? (
                                <div className="">
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

export default ChatPageClient;

