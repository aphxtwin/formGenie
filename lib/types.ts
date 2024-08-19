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

export interface BuildSession extends Record<string, any> {
  id: string
  title: string
  createdAt: Date
  userId: string
  path: string
  messages: Message[]
}