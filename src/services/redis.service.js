import { createClient } from "redis";
import { promisify } from "util";

const redisClient = await createClient({
  //redis[s]://[[username][:password]@][host][:port][/db-number]
  url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
})
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();
// const pexpireAsync = promisify(redisClient.pexpire).bind(redisClient);
// const setnxAsync = promisify(redisClient.setnx).bind(redisClient);

import { reservationInventory } from "../models/repositories/inventory.repo.js";

const acquireLock = async (productId, quantity, cardId) => {
  const keyLock = `lock:${productId}`;
  const reTryTimes = 10;
  const expireTime = 3000; // milliseconds 3s tam lock
  for (let i = 0; i < reTryTimes; i++) {
    // const result = await setnxAsync(keyLock, expireTime);
    const result = await redisClient.set(keyLock, "block_value", {
      NX: true, // Only set if not exist (thay thế setnx)
      PX: expireTime, // Set expire time luôn để tránh deadlock nếu app crash
    });
    if (result === 1) {
      // operate logic
      const resultReservation = await reservationInventory({
        productId,
        quantity,
        cardId,
      });
      if (resultReservation) {
        // await pexpireAsync(keyLock, expireTime);
        return keyLock;
      }
      await redisClient.del(keyLock);
      return null;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 50)); // Wait before retrying
    }
  }
};
const releaseLock = async (keyLock) => {
  return await redisClient.del(keyLock);;
};

export { acquireLock, releaseLock };
