import { createClient } from "redis";
import appConfig from "./env";

export const redisClient = createClient({
  username: appConfig.REDIS_USERNAME,
  password: appConfig.REDIS_PASSWORD,
  socket: {
    host: appConfig.REDIS_HOST,
    port: Number(appConfig.REDIS_PORT),
  },
});

redisClient.on("error", (err: any) => console.log("Redis Client Error", err));

// await client.set('foo', 'bar');
// const result = await client.get('foo');
// console.log(result)  // >>> bar

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log("Redis Connected");
  }
};
