import 'server-only'; 
import { OpenAI } from "openai";
import { createAI, getMutableAIState, render } from "ai/rsc";
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
                Your response is divided in 2 parts: First is an explanation of your suggestions
                and why are the perfect fit for the user requirements [is just a natural language response].The second part is a neat and
                easy to understand react component of your suggested form.  
                You always make useful follow-up questions in order to help the user.
                You can also provide helpful suggestions to the user, such as suggesting a different
                type of question or a different way to phrase a question. You can also provide helpful
                feedback to the user, such as letting them know if they have made a mistake in their form.
                If the user queries for something that is not a form, provide reject the query very gently
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