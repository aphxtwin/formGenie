import prisma from '@/lib/prisma'
import { auth } from '@/auth'
import { Session } from '@/lib/types'
import { Role } from '@prisma/client'
import { Prisma } from '@prisma/client'
import redis from '@/lib/redis';

type BuildSessionSelect = Partial<Record<keyof Prisma.BuildSessionSelect, boolean>>;


export async function createBuildSession(buildSessionId: string, userId: any) {
    const session = (await auth()) as Session

    if (session) {
        const buildSessionKey = `buildSession:${buildSessionId}`
        try {
            // create a build session
            // needs to be created with redis
            // const buildSession = await prisma?.buildSession.create({
            //     data: {
            //         id: buildSessionId,
            //         user: {
            //             connect: {
            //                 id: userId
            //             }
            //         },
            //     }
            // })
            // const buildSession = await redis.hmset(buildSessionKey, {
            //     id: buildSessionId,
            //     userId,
            //     createdAt: Date.now(),
            // })
            const buildSession = await redis.multi()
            .hmset(buildSessionKey, {
                    id: buildSessionId,
                    userId,
                    createdAt: Date.now(),
                })
            .sadd(`user:${userId}:buildSessions`, buildSessionId)
            .exec()

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
    const buildSessionKey = `buildSession:${buildSessionId}`
    const messageKey = `${buildSessionKey}:message:${messageId}`
    try{
        const pipeline = redis.pipeline()
        pipeline.hmset(messageKey,{
            id: messageId,
            content,
            role,
            userId: session.user.id,
            createdAt: Date.now(),
        })
        pipeline.zadd(`${buildSessionKey}:messages`, Date.now(), messageId)
        const results = await pipeline.exec()

        return results ? {id: messageId, content, role} : null
        
    } catch(e:any){
        console.log(e)
        return null
    };
    // this is the message that will be saved in the database
    // needs to be stored with redis
    // await prisma?.message.create({
    //     data: {
    //         id: messageId,
    //         content,
    //         role,
    //         buildingSession: {
    //             connect:{
    //                 id: buildSessionId
    //             }
    //         },
    //         user: {
    //             connect: { id: session.user.id }
    //         }
    //     }
    // });

    redis 

}



export async function getMessagesForBuildSession(buildSessionId: string) {
    // get all messages for a build session
    // needs to be retrieved with redis
    return await prisma?.message.findMany({
      where: { buildingSessionId: buildSessionId },
      orderBy: { timestamp: 'asc' },
    });
}


export async function getAllBuildSessionsFromUser(
    userId: string,
) {
    const userBuildSessionKey = `user:${userId}:buildSessions`

    // get all build sessions for a user
    const buildSessionIds = await redis.smembers(userBuildSessionKey)
    console.log('build session created')
    if (!buildSessionIds) return null;

    const buildSession = await Promise.all(
        buildSessionIds.map(async (id)=>{
            return await redis.hgetall(`buildSession:${id}`)}
        )
    )
    console.log('buildSession', buildSession)
    return buildSession

}


export const loadBsFromDb = async (bsId:any, userId:any) => {
    // load build session from db
    // needs to be retrieved with redis

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
