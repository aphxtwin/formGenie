import {Redis} from 'ioredis';

let redis;

if (process.env.USE_REDIS === 'false') {
  redis = new Redis(
    {
        host: '127.0.0.1', // node 1
        port: 6379,
        password: 'ivokpo',
    },
  );
} else{
  redis = new Redis(
    {
        port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : undefined,
        host: process.env.REDIS_HOST,
        password: process.env.REDIS_PASSWORD,
    }
);
}


export default redis