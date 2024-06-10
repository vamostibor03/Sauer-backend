import express from "express"
import { inference } from "../controllers/chatController"
import { authenticateToken } from "../middlewares/authMiddleware"

const router = express.Router()

router.post("/inference", inference)

export default router
