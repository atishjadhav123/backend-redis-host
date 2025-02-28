"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const validateRequest = (schema) => {
    return (req, res, next) => {
        console.log("Raw FormData Body:", req.body);
        if (req.body.terms === "true") {
            req.body.terms = true;
        }
        else if (req.body.terms === "false") {
            req.body.terms = false;
        }
        if (typeof req.body.language === "string") {
            try {
                req.body.language = JSON.parse(req.body.language);
            }
            catch (_a) {
                req.body.language = req.body.language.split(",").map((lang) => lang.trim());
            }
        }
        try {
            schema.parse(req.body);
            next();
        }
        catch (error) {
            return res.status(400).json({ error: error.errors });
        }
    };
};
exports.validateRequest = validateRequest;
