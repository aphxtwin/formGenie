import prisma from '@/lib/prisma'
import { auth } from '@/auth'
import { Session } from '@/lib/types'
import { Role } from '@prisma/client'
import { Prisma } from '@prisma/client'

type BuildSessionSelect = Partial<Record<keyof Prisma.BuildSessionSelect, boolean>>;


export async function createBuildSession(buildSessionId: string, userId: any) {
    const session = (await auth()) as Session

    if (session) {
        try{
            const buildSession = await prisma?.buildSession.create({
                data: {
                    id: buildSessionId,
                    user: {
                        connect: {
                            id: userId
                        }
                    },
                }
            })
            console.log('created build session')
            return buildSession
        } catch(e){
            console.log(e)
            return null
        }
    } else {
        return null
    }



    
}


export async function saveMessage(messageId:string, content:string, buildSessionId:string, role:Role) {
    `
    In order to save a message requisites:
    1. The user must be authenticated
    2. a buildSessionId to store these messages
    3. the text of the message
    4. the role of the owner of the message (user or assistant)

    `
    const session = (await auth()) as Session

    if (!session) return null;
    console.log('saving message')

    return await prisma?.message.create({
        data: {
            id: messageId,
            content,
            role,
            buildingSession: {
                connect:{
                    id: buildSessionId
                }
            },
            user: {
                connect: { id: session.user.id }
            }
        }
    });

}



export async function getMessagesForBuildSession(buildSessionId: string) {
    return await prisma?.message.findMany({
      where: { buildingSessionId: buildSessionId },
      orderBy: { timestamp: 'asc' },
    });
}


export async function getAllBuildSessionsFromUser(
    userId: string,
    options: {
        select?: BuildSessionSelect;
        orderBy?: 'asc' | 'desc';
        limit?: number;
        offset?: number;
        cacheTTL?: number;
        cacheSWR?: number;
      } = {}
) {
    const {
        select,
        orderBy,
        limit,
        offset,
        cacheTTL,
        cacheSWR,
      } = options;
    
    console.log('getting all build sessions from user')
    return await prisma?.buildSession.findMany({
        where: { userId },
        select,
        orderBy: { updatedAt: orderBy || 'asc' },
        take: limit || 10,
        skip: offset || 0,
        cacheStrategy: {
            ttl: cacheTTL ||75,
            swr: cacheSWR ||120,
        },
    });
}


export const loadBsFromDb = async (bsId:any, userId:any) => {
    if (!userId) return null;
    console.log('loading build session from db')
    return await prisma?.message.findMany({
        where:{
            AND:[
                { buildingSessionId: bsId},
                {userId},
            ],
        },
        orderBy: { timestamp: 'asc' },
        cacheStrategy:{
            ttl: 60,
        }
    });
}
