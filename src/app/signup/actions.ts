'use server';

import { signIn } from 'auth';
import {z} from 'zod';
import prisma from '@/lib/prisma';
import { ResultCode, getStringFromBuffer } from '@/lib/utils';
import { getUser } from '../login/actions';
import AuthError from 'next-auth';

export async function createUser(
    email:string,
    hashedPassword:string,
    salt:string
){
    // we check if an existing user has that alreafy has that email
    const existingUser = await getUser(email);

    if (existingUser){
        return {
            type:'error',
            resultCode:ResultCode.UserAlreadyExists
        }
    } else{
        const user = {
            email,
            password: hashedPassword,
            salt
        }

        await prisma.user.create({
            data: user
        })

        return {
            type:'success',
            resultCode: ResultCode.UserCreated
        }
    }
}

export async function signUp(
    __prevState: ResultCode|undefined,
    formData: FormData,
){
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const parsedCredentials = z
        .object({
            email: z.string().email(),
            password:z.string().min(6)
        })
        .safeParse({
            email,
            password
        })
    if (parsedCredentials.success){
        // salting
        const salt = crypto.randomUUID()
        const encoder = new TextEncoder()
        const saltedPassword = encoder.encode(password+salt)

        const hashedPasswordBuffer = await crypto.subtle.digest(
            'SHA-256',
            saltedPassword
        )
        const hashedPassword = getStringFromBuffer(hashedPasswordBuffer)

        try{
            const result = await createUser(email,hashedPassword,salt)
            console.log(result)
            if(result.resultCode === ResultCode.UserCreated){
                await signIn('credentials',{
                    email,
                    password,
                    redirect: false
                })
                return result
            }
        } catch (error) {
            if (error instanceof AuthError) {
                console.log(error)
              switch (error.type) {
                case 'CredentialsSignin':
                  return {
                    type: 'error',
                    resultCode: ResultCode.InvalidCredentials
                  }
                default:
                  return {
                    type: 'error',
                    resultCode: ResultCode.UnknownError
                  }
              }
            } else {
              return {
                type: 'error',
                resultCode: ResultCode.UnknownError
              }
            }
          }
        } else {
          return {
            type: 'error',
            resultCode: ResultCode.InvalidCredentials
          }
        }
      }