import { z } from "zod";


export const userSchema2 = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Valid email is required" }),
    mobile: z.string().min(10, { message: "Mobile number must be at least 10 digits" }).max(12, { message: "Mobile number must be at most 12 digits" }),
    address: z.string().min(2, { message: "Address must be at least 2 characters" }),
    city: z.enum(["Jalna", "Sambhajinagar", "Pune", "Mumbai", "Delhi", "Ambad"], {
        message: "Please select a valid city",
    }),
    gender: z.enum(["Male", "Female"], { message: "Gender is required" }),
    date: z.preprocess((val) => new Date(val as string), z.date()),
    terms: z.boolean().refine((val) => val === true, {
        message: "You must accept the terms",
    }),
    language: z.array(z.enum(["JavaScript", "HTML", "React", "Redux", "Node.js"])).min(1, {
        message: "Please select at least one language",
    }),
    profile: z.object({
        avatar: z.string().url({ message: "Invalid avatar URL" }).optional(),
        bio: z.string().max(200, { message: "Bio must be at most 200 characters" }).optional(),
        website: z.string().url({ message: "Invalid website URL" }).optional(),
    }).optional(),
});
