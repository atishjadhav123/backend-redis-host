import express from "express"
import { validateRequest } from "../middlewares/validationRequest"
import { createUser, deleteUser, getUserProfile, updateUser, } from "../controller/userController"
import { userSchema2 } from "../Schema/userSchema"
import { upload } from "../utils/Uploads"

const router = express.Router()

router.post("/add", upload, validateRequest(userSchema2), createUser)
router.put("/update/:id", upload, validateRequest(userSchema2), updateUser)
router.delete("/delete/:id", deleteUser)
router.get("/getdata", getUserProfile)


export default router
