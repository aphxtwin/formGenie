import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { authConfig } from './auth.config'
import { z } from 'zod'
import { getUser } from '@/app/login/actions'
import GoogleProvider from "next-auth/providers/google"
import{ PrismaAdapter } from "@auth/prisma-adapter"
import { getStringFromBuffer } from '@/lib/utils'
import prisma from '@/lib/prisma'

export const {auth, signIn, signOut} = NextAuth({
    ...authConfig,
    providers:[
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
    Credentials({
        async authorize(credentials){
            const parsedCredentials = z.object({
                email: z.string().email(),
                password: z.string().min(8),
            }).safeParse(credentials)
            if (parsedCredentials.success){
                const {email,password} = parsedCredentials.data
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
                return null
            }
        }
    })
    ],
    adapter: PrismaAdapter(prisma),
})

