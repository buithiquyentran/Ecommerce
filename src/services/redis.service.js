import redis from 'redis';
import { promisify } from 'util';
const redisClient = redis.createClient()

const pexpireAsync = promisify(redisClient.pexpire).bind(redisClient);
const setnxAsync = promisify(redisClient.setnx).bind(redisClient);

const acquireLock = async (productId, quantity, cardId) => {
    const keyLock = `lock:${productId}`;
    const reTryTimes = 10;
    const expireTime = 3000; // milliseconds 3s tam lock
    for (let i = 0; i < reTryTimes; i++) {
        const result = await setnxAsync(keyLock, `${cardId}:${quantity}`);
        if (result === 1) {
            await pexpireAsync(keyLock, expireTime);

        }
        else {
            await new Promise(resolve => setTimeout(resolve, 50)); // Wait before retrying
        }
    return false;
};
const releaseLock = async (keyLock) => {
    const delAsync = promisify(redisClient.del).bind(redisClient);
    return await delAsync(keyLock);
};

export { acquireLock, releaseLock };