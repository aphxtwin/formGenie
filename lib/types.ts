import { CoreMessage } from 'ai'

export type Message = CoreMessage & {
  id: string
}

export interface User extends Record<string, any> {
  id: string
  email: string
  password: string
  salt: string
}

export interface Session {
  user: {
    id: string
    email: string
  }
}
