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
  if(messages){
    console.log(messages, 'messages pedorros con sida')
  }
    useEffect(() => {
        router.refresh()
    }
    ,[])

    const handleInputChange = (e:any) => {
        setInput(e.target.value)
    }



    const fetchComponents = async () => {
      const response = await fetch(
        `http://localhost:3003/components/list?framework=react&components=shadcn&icons=lucide`
      );
      const data = await response.json();
      setLoadedComponents([...Array(data.items.length).keys()].map(e => false));
      console.log(data, 'data')
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
      //we could set the bsession active here!!
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
       <div className="w-screen h-screen flex">
        <nav className="w-[3.2rem] bg-gray-100 border-2 "></nav>
        <div className="w-1/2 h-full pl-[2rem] pt-4 flex flex-col gap-[1.1rem]">
          {
            messages.map((message:any) => (
            <div key={message.id}>
              {message.display}
            </div>
          ))
          }
          <div className="flex justify-center  md:fixed left-[6%] bottom-3">
            <PromptForm className={`${input ? '' : 'h-[58px]' } mb-1 w-[90vw] md:w-[600px]  max-h-[150px] px-5`} isTheFirstMessage={false} input={input} handleInputChange={handleInputChange} handleSubmit={handleSubmission}/>
          </div>
        </div>
        <div className="w-1/2 h-full">
          {loadedComponents.map((component, index) => (
                          <div className="w-full flex flex-col justify-center h-screen" key={index}>
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
    );


};

export default ChatPageClient;


// {
//   messages.map((message:any) => (
//   <div key={message.id}>
//     {message.display}
//   </div>
// ))
// }


