import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import  {authConfig}  from 'auth.config'
import { z } from 'zod'
import { getUser } from '@/app/login/actions'
import GoogleProvider from "next-auth/providers/google"
import{ PrismaAdapter } from "@auth/prisma-adapter"
import { getStringFromBuffer } from '@/lib/utils'
import prisma from '@/lib/prisma'

 const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers:[
    Credentials({
        async authorize(credentials) {
            if (!credentials){
                return null
            }
            const parsedCredentials = z.object({
                email: z.string().email(),
                password: z.string().min(8),
            }).safeParse(credentials)

            if(!parsedCredentials) {
                return null
            }

            if (parsedCredentials.success){
                const {email,password} = parsedCredentials.data
                console.log(email, password, 'email and password')
                const user = await getUser(email)
                if (!user) return null;

                const encoder = new TextEncoder();
                const saltedPassword = encoder.encode(password + user.salt);
                const hashedPasswordBuffer = await crypto.subtle.digest(
                    'SHA-256',
                    saltedPassword
                )
                const hashedPassword = getStringFromBuffer(hashedPasswordBuffer)

                if (hashedPassword === user.password){
                    return user
                } else {
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
    adapter: PrismaAdapter(prisma),
})

export {auth, signIn, signOut} 