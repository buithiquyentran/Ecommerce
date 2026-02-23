import { createClient } from "redis";
import { promisify } from "util";

const redisClient = await createClient()
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();
const pexpireAsync = promisify(redisClient.pexpire).bind(redisClient);
const setnxAsync = promisify(redisClient.setnx).bind(redisClient);

import { reservationInventory } from "../models/repositories/inventory.repo.js";

const acquireLock = async (productId, quantity, cardId) => {
  const keyLock = `lock:${productId}`;
  const reTryTimes = 10;
  const expireTime = 3000; // milliseconds 3s tam lock
  for (let i = 0; i < reTryTimes; i++) {
    const result = await setnxAsync(keyLock, expireTime);
    if (result === 1) {
      // operate logic
      const resultReservation = await reservationInventory({
        productId,
        quantity,
        cardId,
      });
      if (resultReservation) {
        await pexpireAsync(keyLock, expireTime);
        return keyLock;
      }
      return null;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 50)); // Wait before retrying
    }
  }
};
const releaseLock = async (keyLock) => {
  const delAsync = promisify(redisClient.del).bind(redisClient);
  return await delAsync(keyLock);
};

export { acquireLock, releaseLock };
