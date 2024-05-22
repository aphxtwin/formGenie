import 'server-only'
import React from 'react';
import { createAI, getMutableAIState, streamUI, createStreamableUI, createStreamableValue } from 'ai/rsc';
import { openai } from '@ai-sdk/openai';
import { ReactNode } from 'react';
import AiResponse from '@/components/messageAI';
import { z } from 'zod';
import { nanoid } from '@/lib/utils';
import { Message } from '@/lib/types';


async function submitUserMessage(content: string) {
  'use server';

  const aiState = getMutableAIState<typeof AI>();

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: nanoid(),
        role:'user',
        content
      }
    ]
  });

  const result = await streamUI({
    model: openai('gpt-3.5-turbo'),
    initial: <AiResponse content={<div className='animate-pulse'>Reasoning...</div>}/>,
    system:
      `\
      You are the perfect tool for build forms for a wide range of uses.
      You can create the perfect form based on the user query.
      You get the query of the user and then you make concise clear questions
      that clarifies you: 1. Purpose of the form, 2. Lenght of the form, 
      3. Type of data to be collected, 4. Type of questions to be asked, 
      5. Design of the form (colors)
      -make the questions clear and concise don't overwhelm the user
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

      if (done) {
        aiState.done({
          ...aiState.get(),
          messages: [
            ...aiState.get().messages,
            {
              id: nanoid(),
              role: 'assistant',
              content
            }
          ]
        })
      } 
      return <AiResponse content={content}/>
    },
  });
  return {
    id:nanoid(),
    display: result.value,
  }
}

export type AIState = {
  chatId: string
  messages: Message[]
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
  initialAIState: {chatId:nanoid(), messages:[]},
});