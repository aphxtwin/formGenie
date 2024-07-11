import NextAuth from 'next-auth'
import  authConfig  from './auth.config'
import prisma from './lib/prisma'
import { PrismaAdapter } from '@auth/prisma-adapter'
import Credentials from 'next-auth/providers/credentials'
import GoogleProvider from "next-auth/providers/google"
import { z } from 'zod'
import { getUser } from '@/app/login/actions'

import { getStringFromBuffer } from '@/lib/utils'


export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    adapter: PrismaAdapter(prisma),
    session:{strategy:'jwt'},
    providers:[
        Credentials({
            async authorize(credentials): Promise<any>{
                if (!credentials){
                    console.error('no credentials from auth')
                    return null
                }
    
                const parsedCredentials = z.object({
                    email: z.string().email(),
                    password: z.string().min(6),
                }).safeParse(credentials)
    
                if(!parsedCredentials) {
                    console.error('no parsed credentials')
                    return null
                }
    
                if (parsedCredentials.success){
                    const {email,password} = parsedCredentials.data
                    const user = await getUser(email)
                    if (!user){
                        console.error('no user found')
                        return null
                    }
                    const encoder = new TextEncoder();
                    const saltedPassword = encoder.encode(password + user?.salt);
                    const hashedPasswordBuffer = await crypto.subtle.digest(
                        'SHA-256',
                        saltedPassword
                    )
                    const hashedPassword = getStringFromBuffer(hashedPasswordBuffer)
    
                    if (hashedPassword === user?.password){
                        console.log('ok creds', user)
                        return user
                    } else {
                        console.error('wrong password')
                        return null
                    }
                } else if (parsedCredentials.error){
                    console.error(parsedCredentials.error, 'error of credentials')
                    return null
                }
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
            profile(profile) {
                return {
                    id: profile.id,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                };
            },
        }),
    ],
    
    
})
