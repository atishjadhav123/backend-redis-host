import multer from "multer"
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import { Request } from "express"
import dotenv from "dotenv"

dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req: Request, file: Express.Multer.File) => ({
        folder: "profile_uploads",
        format: file.mimetype.split("/")[1],
        public_id: `${Date.now()}-${file.originalname}`,
    }),
})
export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
}).single("profile")
