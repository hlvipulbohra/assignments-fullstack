import Redis from "ioredis";

export const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  retryStrategy(times: number) {
   return times*5000;
  },
});

redis.on("connect", () => {
  console.log("[Redis] connected");
  redis.flushall();
});
redis.on("error", (err) => console.error("[Redis] error:", err));
