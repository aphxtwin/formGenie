import {Redis} from 'ioredis';

const redis = new Redis(
    {
        port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : undefined,
        host: process.env.REDIS_HOST,
        password: process.env.REDIS_PASSWORD,
    }
);
redis.on('connect', () => {
    console.log('Connected to Redis');
  });
  redis.on('error', (err) => {
    console.error('Redis connection error:', err);
  });
export default redis