import prisma from '@/lib/prisma'
import { auth } from '@/auth'
import { Session } from '@/lib/types'
import { Role } from '@prisma/client'
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
    
    return await prisma?.message.create({
        data: {
            id: messageId,
            content,
            role,
            buildingSessionId:buildSessionId,

        }
    })

}


export async function getMessagesForBuildSession(buildSessionId: string) {
    return await prisma?.message.findMany({
      where: { buildingSessionId: buildSessionId },
      orderBy: { timestamp: 'asc' },
    });
}


export async function getAllBuildSessionsFromUser(userId: string) {
    return await prisma?.buildSession.findMany({
        where: { userId },
        orderBy: { updatedAt: 'asc' },
    });
}