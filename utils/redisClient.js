"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const redisClient = new ioredis_1.default(process.env.REDIS_URL || "redis://localhost:6379");
redisClient.on("error", (err) => {
    console.error("❌ Redis connection error:", err);
});
redisClient.on("connect", () => {
    console.log("✅ Redis Connected!");
});
exports.default = redisClient;
