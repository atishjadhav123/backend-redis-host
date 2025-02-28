import { Request, Response, NextFunction } from "express"
import { AnyZodObject } from "zod"

export const validateRequest = (schema: AnyZodObject): any => {
    return (req: Request, res: Response, next: NextFunction) => {
        console.log("Raw FormData Body:", req.body)
        if (req.body.terms === "true") {
            req.body.terms = true
        } else if (req.body.terms === "false") {
            req.body.terms = false
        }
        if (typeof req.body.language === "string") {
            try {
                req.body.language = JSON.parse(req.body.language)
            } catch {
                req.body.language = req.body.language.split(",").map((lang: string) => lang.trim())
            }
        }
        try {
            schema.parse(req.body)
            next()
        } catch (error: any) {
            return res.status(400).json({ error: error.errors })
        }
    }
}
