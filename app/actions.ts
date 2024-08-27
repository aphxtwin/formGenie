import prisma from '@/lib/prisma'
import { auth } from '@/auth'
import { Session } from '@/lib/types'
import { Prisma } from '@prisma/client'
import redis from '@/lib/redis';

type BuildSessionSelect = Partial<Record<keyof Prisma.BuildSessionSelect, boolean>>;


export async function createBuildSession(buildSession:any) {
    const session = (await auth()) as Session

    const {id, title, creatorId, createdAt, messages, path } = buildSession
    if (session) {
        const buildSessionKey = `buildSession:${id}`
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
                    id,
                    userId: creatorId,
                    createdAt,
                    title,
                    path,
                })
            .sadd(`user:${creatorId}:buildSessions`, id)
            .exec()
            console.log('build session created', buildSession)
            return buildSession
        } catch(e){
            console.log(e)
            return null
        }
    } else {
        return null
    }



    
}


export async function saveMessage(messageId:string, content:string, buildSessionId:string, role:any) {
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
        console.log(results, 'results')
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

}



export async function getMessagesFromBuildSession(buildSessionId: string) {
    // get all messages for a build session
    // needs to be retrieved with redis
    // return await prisma?.message.findMany({
    //   where: { buildingSessionId: buildSessionId },
    //   orderBy: { timestamp: 'asc' },
    // });
    const buildSessionKey = `buildSession:${buildSessionId}`;
    const messagesKey = `buildSession:${buildSessionId}:messages`
    const orderedMessagesIds = await redis.zrange(messagesKey, 0, -1)
    const messages = await Promise.all(
        orderedMessagesIds.map(async(messageId)=>{
            const messageKey = `${buildSessionKey}:message:${messageId}`
            const message = await redis.hgetall(messageKey)
            return message
        })
    )
    console.log('messages kkgongos', messages)
    return messages

    
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

    // First we check if the session exists for the user
    const userBuildSessionKey = `user:${userId}:buildSessions`
    const buildSessionExists = await redis.sismember(userBuildSessionKey, bsId)

    if(!buildSessionExists){
        console.log('doesn&t exist') 
        return null
    };
    
    const messages = await redis.hgetall(`buildSession:${bsId}`)
    console.log('messages', messages)
    return messages
}


    // return await prisma?.message.findMany({
    //     where:{
    //         AND:[
    //             { buildingSessionId: bsId},
    //             {userId},
    //         ],
    //     },
    //     orderBy: { timestamp: 'asc' },
    //     cacheStrategy:{
    //         ttl: 60,
    //     }
    // });