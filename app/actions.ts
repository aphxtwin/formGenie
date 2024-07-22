import prisma from '@/lib/prisma'
import { auth } from '@/auth'
import { Session } from '@/lib/types'

export async function createBuildSession(buildSessionId: string, userId: any) {
    const session = (await auth()) as Session

    if (session) {
        try{
            const buildSession = await prisma.buildSession.create({
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


export async function saveMessage(text, buildSessionId){
    `
    In order to save a message requisites:
    1. The user must be authenticated
    2. a buildSessionId to store these messages
    3. the text of the message
    4. the role of the owner of the message (user or assistant)

    `
    const session = (await auth()) as Session

    if (session) {
        console.log('session', session)
    } else {
        return null
    }


}