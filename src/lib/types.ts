import { CoreMessage } from 'ai'

export type Message = CoreMessage & {
  id: string
}

export interface Session {
  user: {
    id: string
    email: string
  }
}