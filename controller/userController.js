"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfile = exports.deleteUser = exports.updateUser = exports.createUser = void 0;
const cloudinary_1 = require("cloudinary");
const user_1 = __importDefault(require("../model/user"));
const redisClient_1 = __importDefault(require("../utils/redisClient"));
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Request body:", req.body);
        console.log("Uploaded file:", req.file);
        let profileImageUrl = "";
        if (req.file) {
            try {
                const cloudinaryResponse = yield cloudinary_1.v2.uploader.upload(req.file.path, {
                    folder: "profile_uploads",
                });
                profileImageUrl = cloudinaryResponse.secure_url;
            }
            catch (error) {
                return res.status(500).json({ message: "File upload failed", error });
            }
        }
        const userData = {
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            address: req.body.address,
            city: req.body.city,
            gender: req.body.gender,
            language: req.body.language,
            date: req.body.date,
            terms: req.body.terms === "true",
            profile: profileImageUrl,
        };
        const newUser = new user_1.default(userData);
        yield newUser.save();
        yield redisClient_1.default.set("users", JSON.stringify(yield user_1.default.find()), "EX", 3600);
        res.status(201).json({ message: "User created successfully", user: newUser });
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
});
exports.createUser = createUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        console.log(id);
        const existingUser = yield user_1.default.findById(id);
        if (!existingUser) {
            return res.status(404).json({ message: "user not found" });
        }
        let profileImageUrl = existingUser.profile;
        if (req.file) {
            try {
                if (existingUser.profile) {
                    const oldImageId = (_a = existingUser.profile.split("/").pop()) === null || _a === void 0 ? void 0 : _a.split(".")[0];
                    if (oldImageId) {
                        yield cloudinary_1.v2.uploader.destroy(`profile_uploas${oldImageId}`);
                    }
                }
                const cloudinaryResponse = yield cloudinary_1.v2.uploader.upload(req.file.path, {
                    folder: 'profile_uploas'
                });
                profileImageUrl = cloudinaryResponse.secure_url;
            }
            catch (error) {
                return res.status(500).json({ message: "file upload failed", error });
            }
        }
        let languages = [];
        if (typeof req.body.language === "string") {
            try {
                languages = JSON.parse(req.body.language);
            }
            catch (error) {
                languages = req.body.language.split("/").map((lang) => lang.trim());
            }
        }
        else if (Array.isArray(req.body.language)) {
            languages = req.body.language;
        }
        const updateUser = yield user_1.default.findByIdAndUpdate(id, {
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            address: req.body.address,
            city: req.body.city,
            gender: req.body.gender,
            date: req.body.date,
            terms: req.body.terms === "true",
            language: languages,
            profile: profileImageUrl,
        }, { new: true });
        yield redisClient_1.default.set("users", JSON.stringify(yield user_1.default.find()), "EX", 3600);
        res.status(200).json({ message: "user update successfully", user: updateUser });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server Error", error });
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const existingUser = yield user_1.default.findById(id);
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }
        if (existingUser.profile) {
            const imageId = (_a = existingUser.profile.split("/").pop()) === null || _a === void 0 ? void 0 : _a.split(".")[0];
            if (imageId) {
                yield cloudinary_1.v2.uploader.destroy(`profile_uploads/${imageId}`);
            }
        }
        yield user_1.default.findByIdAndDelete(id);
        yield redisClient_1.default.set("users", JSON.stringify(yield user_1.default.find()), "EX", 3600);
        res.status(200).json({ message: "User deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
});
exports.deleteUser = deleteUser;
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cacheKey = "allUsers";
        const cachedData = yield redisClient_1.default.get(cacheKey);
        if (cachedData) {
            console.log("✅ Fetched from Redis Cache");
            return res.json(JSON.parse(cachedData));
        }
        // Fetch all users from MongoDB
        const users = yield user_1.default.find().sort({ createdAt: -1 }); // Sort by latest users
        if (!users.length) {
            return res.status(404).json({ message: "No users found" });
        }
        // Store data in Redis with expiration time (5 minutes)
        yield redisClient_1.default.set(cacheKey, JSON.stringify(users), "EX", 300);
        console.log("📦 Fetched from MongoDB & Cached in Redis");
        return res.json({ message: "user find success", users });
    }
    catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getUserProfile = getUserProfile;
