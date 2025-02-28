import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redisClient = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

redisClient.on("error", (err) => {
    console.error("❌ Redis connection error:", err);
});

redisClient.on("connect", () => {
    console.log("✅ Redis Connected!");
});

export default redisClient;
