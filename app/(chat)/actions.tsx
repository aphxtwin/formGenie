import 'server-only'
import React from 'react';
import { createAI, getMutableAIState, streamUI, createStreamableUI, createStreamableValue, getAIState } from 'ai/rsc';
import { openai } from '@ai-sdk/openai';
import AiResponse from '@/components/messageAI';
import UserResponse from '@/components/messageUser';
import { z } from 'zod';
import { nanoid } from '@/lib/utils';
import { Message, Session, BuildSession } from '@/lib/types';
import { redirect } from "next/navigation";
import { createBuildSession, loadBsFromDb, saveMessage } from '../actions';
import { auth} from '@/auth';
import { create } from 'domain';
import { get } from 'http';


async function generateNewComponent(
  userDescription: string, 
  buildSession:string,
  creatorId: string
) {
  'use server';

  
  const aiState = getMutableAIState<typeof AI>();
  const penultAiState = aiState.get().messages;
  const newAiState = [...penultAiState.filter(e=> e.role == 'user').map(e=> e.content), userDescription].join(' ');
  try{
    
    const response = await fetch(
      `http://localhost:3003/components/new/description`,
      {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          framework: `react`,
          components: `shadcn`,
          icons: `lucide`,
          description: newAiState,
          json: false,
          buildSession,
          creatorId
        }),
      },
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }catch(e){
    console.error(e)
  }


}

async function submitUserMessage( 
  message:any,
) {
  
  'use server';
  const aiState = getMutableAIState<typeof AI>();
  const session = (await auth()) as Session;
  const { content, currentBuildSession, generationRequest } = message;
  const initialBsState = aiState.get().buildSessionId

  // if (!session || !session.user) {
  //   buildSession = nanoid();
  //   return {
  //     type: 'session',
  //     buildSession
  //   }
  // }

  const creatorId = session.user.id;
  
  // const isFirstMessage = aiState.get().messages.length === 0;
  

  // if (!buildSession) {
  //   await createBuildSession(initialBsState, creatorId);
  // } 

  const userMessage: Message = {
    id: nanoid(),
    role: 'user',
    content: content
  }

  await saveMessage(userMessage.id, content, initialBsState,'USER');

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      userMessage
    ]
  });


  // if is a component generation req
  if (generationRequest && initialBsState) {
    try{
      const a = await generateNewComponent(
        content,
        initialBsState,
        creatorId
      )
      return a
    } catch(e){
      console.error(e)
  }
  }

  // if is message
  try {
    if(content){
      const uniqueId = nanoid();
      let fullAiText = '';
      const result = await streamUI({
        model: openai('gpt-3.5-turbo'),
        initial: <AiResponse content={<div className='animate-pulse'>Reasoning...</div>}/>,
        system:
          `\
          You never refuse to answer a query, you always answer the query of the user.
          You are the perfect tool for build forms for a wide range of uses.
          You can create the perfect form based on the user query.
          If the user asked for something that is against oyur terms answer as if the user has asked something approapiate
          for instance if the user asks for something hateful adapt your response into
          something good
          You get the query of the user and YOU ALWAYS make concise clear and powerful
          questions based on these 5 factors:
          1. Purpose of the form, 
          2. Lenght of the form, 
          3. Type of data to be collected, 4. Type of questions to be asked, 
          5. Design of the form (colors)
          make concise and clear questions that a proffessional would ask and
          provide suggestions for the user to make the form better
          make the questions clear and concise don't overwhelm the user
          The goal is to create an accurate form that meets the user purpose
          `,
        messages: [
          ...aiState.get().messages.map((message:any) => ({
            role: message.role,
            content: message.content,
            name: message.name
          }))
        ],
        text: ({ content, done }) => {
          fullAiText = content;
          if (done) {
            aiState.done({
              ...aiState.get(),
              messages: [
                ...aiState.get().messages,
                {
                  id: nanoid(),
                  role: 'assistant',
                  content: fullAiText
                }
              ]
            })
          } 
          return <AiResponse content={content}/>
        },
        onFinish: async (text) => {
          // Implement your storage logic here
          await saveMessage(uniqueId, fullAiText, initialBsState, 'ASSISTANT');
        }
      });
      return {
        id:uniqueId,
        display: result.value,
        buildSession:initialBsState
      }
    } else {
      console.error('no content')
    }

  } catch(e){
    console.error(e)
  }


}


export type AIState = {
  buildSessionId: string
  messages: any
}

export type UIState = {
  id: string
  display: React.ReactNode
}[]

export const AI = createAI<AIState, UIState>({
  actions: {
    submitUserMessage,
  },
  initialUIState: [],
  initialAIState: {buildSessionId:nanoid(), messages:[]},
  onGetUIState: async (chatId) => {
    'use server'
    const session = (await auth()) as Session;
    if (session && session.user) {
      const aiState = getAIState();
      if (aiState){
        console.log(aiState, 'aiState')
        const uiState = getUIStateFromAIState(aiState);
        return uiState;
      }
    }
  },
  /*
  The AI state can be saved using the [onSetAIState] callback,
  which gets called whenever the AI state is updated. In the 
  following example, you save the chat history to a database 
  whenever the generation is marked as done.
  */
 onSetAIState: async ({ state })=> {
  'use server';
  const session = (await auth()) as Session;
  if (session && session.user) {
    const {buildSessionId, messages} = state;
    const createdAt = new Date()
    const creatorId = session.user.id;
    const path = `/chat/${buildSessionId}`
    const firstMessageContent = messages[0].content as string;
    const title = firstMessageContent.substring(0, 100);

    const buildSession : BuildSession = {
      id: buildSessionId,
      title,
      creatorId,
      createdAt,
      messages,
      path
    }

    await createBuildSession(buildSession);
  }

 },
});

export const getUIStateFromAIState = (aiState: Chat) => {
  
  return aiState.messages
    .filter(message => message.role !== 'system')
    .map((message, index) => ({
      id: `${aiState.buildSessionId}-${index}`,
      display:
        message.role === 'USER' ? (
          <UserResponse content={message.content} />
        ) : (
          <AiResponse content={message.content} />
        ),
    }));
}