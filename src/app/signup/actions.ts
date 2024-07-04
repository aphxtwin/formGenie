'use server';

import { signIn } from 'auth';
import {z} from 'zod';
import prisma from '@/lib/prisma';
import { ResultCode } from '@/lib/utils';
import { getUser } from '../login/actions';
// import {AuthError} from 'next-auth';

export async function createUser(
    email:string,
    hashedPassword:string,
    salt:string
){
    // we check if an existing user has that alreafy has that email
    const existingUser = await getUser(email);

    if (existingUser){
        return {
            type: 'error',
            resultCode:ResultCode.UserAlreadyExists
        }
    } else{
        const user = {
            email,
            password: hashedPassword,
            salt
        }

        await prisma.user.create({
            data: {
                email,
                password:hashedPassword,
                salt
            }
        })

        return {
            type:'success',
            resultCode: ResultCode.UserCreated
        }
    }
}

export async function signUp(){
    
}