import express, { NextFunction, Request, Response } from "express"
import userRoutes from "./routes/userRoutes"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import redisClient from "./utils/redisClient"
dotenv.config()
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use(cors({
    origin: "http://localhost:5173", // ✅ Set specific allowed origin
    credentials: true, // ✅ Allow cookies & auth headers
    methods: ["GET", "POST", "PUT", "DELETE"], // ✅ Allowed request methods
    allowedHeaders: ["Content-Type", "Authorization"], // ✅ Allowed headers
}))
app.use("/uploads", express.static("uploads"))

app.use("/api", userRoutes)

app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ message: "Route Not Found" })
})


mongoose.connect(process.env.MONGO_URL as string)

const PORT = Number(process.env.PORT) || 5000;
(async () => {
    try {
        await redisClient.set("testKey", "Hello Redis")
        const value = await redisClient.get("users")
        console.log("Retrieved from Redis:", value)
    } catch (err) {
        console.error("Redis Error:", err)
    }
})()
mongoose.connection.once("open", () => {
    console.log("MONGO CONNECTED")

    app.listen(PORT, () => console.log(`Server Running on port ${PORT}`))

})

// console.log("Server running on http://localhost:5000")









// import express, { NextFunction, Request, Response } from "express";
// import userRoutes from "./routes/userRoutes";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";
// import redisClient from "./utils/redisClient";

// dotenv.config();

// const app = express();

// // Middleware
// app.use(cors({ origin: "http://localhost:5173", credentials: true }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static("dist"));
// app.use("/uploads", express.static("uploads"));

// // Routes
// app.use("/api", userRoutes);

// // 404 Error Handling
// app.use((req: Request, res: Response, next: NextFunction) => {
//     res.status(404).json({ message: "Route Not Found" });
// });

// // Connect to MongoDB
// mongoose.connect(process.env.MONGO_URL as string)
//     .then(() => console.log("✅ MongoDB Connected"))
//     .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// const PORT = Number(process.env.PORT) || 5000;

// // Connect to Redis
// (async () => {
//     try {
//         await redisClient.connect(); // Ensure Redis is connected
//         await redisClient.set("testKey", "Hello Redis");
//         const value = await redisClient.get("testKey");
//         console.log("✅ Retrieved from Redis:", value);
//     } catch (err) {
//         console.error("❌ Redis Connection Error:", err);
//     }
// })();

// // Start Server after MongoDB connects
// mongoose.connection.once("open", () => {
//     app.listen(PORT, () => console.log(`🚀 Server Running on port ${PORT}`));
// });
