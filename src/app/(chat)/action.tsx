import 'server-only'; 
import { OpenAI } from "openai";
import { createAI, getAIState, getMutableAIState, render } from "ai/rsc";
// import { z } from "zod";
import { nanoid } from '@/lib/utils';
import AiResponse from '@/components/messageAI';
const openaiApiKey = process.env.OPENAI_API_KEY
const openai = new OpenAI({
    apiKey:openaiApiKey,
});




// An example of a spinner component. You can also import your own components,
// or 3rd party component libraries.
function Spinner() {
    return <AiResponse content={<div className='animate-pulse'>Loading...</div>}/>
}


async function submitUserMessage(userInput: string) {
    'use server';
    const aiState = getMutableAIState<typeof AI>();
    const history = getAIState();
    console.log('ESTE ES EL HISTORY=>', history)
    // update the AI state with the user's message
    aiState.update([
        ...aiState.get(),
        {
            id: nanoid(),
            role: 'user',
            content: userInput,
        },
    ]);
    console.log(aiState.get())
    // the render() cretaes a generated, streamable UI
    const ui = render({
        model:"gpt-3.5-turbo",
        provider:openai,
        initial: <Spinner/>,
        messages:[
        {
            role:'system',
            content:
                `
                You are the perfect tool for build forms for a wide range of uses.
                You can create the perfect form based on the user query.
                You get the query of the user and then you make concise clear questions
                that clarifies you: 1. Purpose of the form, 2. Lenght of the form, 
                3. Type of data to be collected, 4. Type of questions to be asked, 
                5. Design of the form (colors)
                -Answer in the same language of the user query
                -make the questions clear and concise don't overwhelm the user
                The goal is to create an accurate form that meets the user purpose
                `,
        },
        ...aiState.get().map((message:any) => ({ role: message.role, content: message.content } )),

        ],
        text: ({ content, done }) => {
            // When it's the final content, mark the state as done and ready for the client to access.
            if (done) {
              aiState.done([
                ...aiState.get(),
                {
                  role: "assistant",
                  content
                }
              ]);
            }
       
            return <AiResponse content={content}/>
          },
    })

    return {
        id: nanoid(),
        display: ui,
    }
    
}

// Define the initial state of the AI. It can be any JSON object.
const initialAIState: {
    role: 'user' | 'assistant' | 'system' | 'function';
    content: string;
    id?: string;
  }[] = [];
   
  // The initial UI state that the client will keep track of, which contains the message IDs and their UI nodes.
  const initialUIState: {
    id: number;
    display: React.ReactNode;
  }[] = [];

// AI is a provider you wrap your application with so you can access AI and UI state in your components.
export const AI = createAI({
    actions: {
      submitUserMessage
    },
    // Each state can be any shape of object, but for chat applications
    // it makes sense to have an array of messages. Or you may prefer something like { id: number, messages: Message[] }
    initialUIState,
    initialAIState
  });