'use server'
import prisma from '@/lib/prisma';
import { ResultCode } from '@/lib/utils';
import { z } from 'zod';
import { signIn } from '@/auth';

import  {AuthError}  from 'next-auth'

interface Result {
    type:string,
    resultCode:ResultCode
}

export async function getUser(email:string) {
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })
    return user
}


export async function authenticate(
    __prevState: ResultCode|undefined,
    formData: FormData,
): Promise<Result | undefined> {
    
    console.log('Authentication attempt started');
    try {
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        console.log(`Attempting authentication for email: ${email.slice(0, 3)}...`);

        const parsedCredentials = z
            .object({
                email: z.string().email(),
                password: z.string().min(6)
            })
            .safeParse({ email, password });


        if (parsedCredentials.success) {
            try{
                await signIn('credentials', {
                    email,
                    password,
                    redirect: false
                });
                console.log('Authentication successful');
                return {
                    type: 'success',
                    resultCode: ResultCode.UserLoggedIn
                };
            } catch(e){console.log(e, 'cacaca')}

        } else {
            console.error('Credential validation failed PUTOO:', parsedCredentials.error);
            return {
                type: 'error',
                resultCode: ResultCode.InvalidCredentials
            };
        }
    } catch (error) {
        console.error('Authentication error:', error);
        if (error instanceof AuthError) {
            console.error('NextAuth AuthError:', error.type);
            return {
                type: 'error',
                resultCode: ResultCode.InvalidCredentials
            };
        } else {
            return {
                type: 'error',
                resultCode: ResultCode.UnknownError
            };
        }
    }
}
