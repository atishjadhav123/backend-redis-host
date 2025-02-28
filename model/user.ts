import mongoose, { Schema, Document } from "mongoose"

interface IUser extends Document {
    name: string
    email: string
    mobile: string
    date: Date
    city: string
    address: string
    gender: "Male" | "Female"
    terms: string
    language: string[]
    profile: string
}

const userSchema: Schema<IUser> = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        mobile: { type: String, required: true, unique: true },
        date: { type: Date, required: true },
        city: { type: String, enum: ["Jalna", "Sambhajinagar", "Pune", "Mumbai", "Delhi", "Ambad"], required: true },
        address: { type: String, required: true },
        gender: { type: String, enum: ["Male", "Female"], required: true },
        language: { type: [String], enum: ["JavaScript", "HTML", "React", "Redux", "Node.js"], required: true },
        profile: { type: String, required: false },
    },
    { timestamps: true }
)

const User = mongoose.model<IUser>("User", userSchema)
export default User





