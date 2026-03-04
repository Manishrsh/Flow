import { createClient } from 'redis';
import { logger } from '../utils/logger';

export const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

export const connectRedis = async (): Promise<void> => {
    try {
        await redisClient.connect();
        logger.info('Redis Connected');

        redisClient.on('error', (err) => {
            logger.error('Redis Client Error:', err);
        });

        redisClient.on('reconnecting', () => {
            logger.info('Redis Client Reconnecting');
        });

    } catch (error) {
        logger.error('Error connecting to Redis:', error);
        // Don't exit process, Redis is optional for basic functionality
    }
};

export default redisClient;
