'use client'
import React, {useState, useEffect} from "react";
import PromptForm from "@/components/prompt-form";
import UserMessage from "@/components/messageUser";
import { useAIState, useActions, useUIState } from 'ai/rsc';
import { nanoid } from "@/lib/utils";

interface ComponentType {
  component: React.ComponentType;
}
const ChatPage = () => {
    const [input, setInput] = useState<string>("")
    const [loadedComponents, setLoadedComponents] = useState<ComponentType[]>([]);
    // const [componentVersions, setComponentVersions] = useState([]);
    const [messages] = useUIState();
    const [aiState] = useAIState();
    const [_, setMessages] = useUIState<typeof AI>();
    const [processing, setProcessing] = useState<boolean>(false);
    const {submitUserMessage, generateNewComponent} = useActions();

   

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


    useEffect(() => {
      fetchComponents()
    }, []);

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
      const res = await generateNewComponent(userDescription);
      if (res){
        fetchComponents();
        setProcessing(false);
      }

    }


    return (
        <div className="h-lvh">
        <div className="bg-neutral-900 border-b-2 border-zinc-600 h-[60px]"></div>

              <div className="grid grid-cols-2 gap-1">
                  
                  <div className="col-span-1 h-[90vh]">
                      <div className="flex relative flex-col overflow-y-scroll mx-2 my-1 h-[80vh]">
                      <div className="py-3 px-2">
                      {
                          messages.map((message) => (
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
                      <h1 className="text-4xl font-bold text-center flex pt-2 pb-1 capitalize text-neutral-900">Preview your form</h1>
                      <div className='my-2'>
                        <div className='overflow-y-scroll w-[510px] h-[77vh] bg-white rounded-3xl shadow-gray-900/50 shadow-2xl'>
 
                          
                          {loadedComponents.map((component, index) => (
                            <div className="" key={index}>
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

export default ChatPage;

