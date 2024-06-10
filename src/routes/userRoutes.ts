import express from "express"
import {
  registerUser,
  loginUser,
  googleAuth,
} from "../controllers/userController"
import { authenticateToken } from "../middlewares/authMiddleware"

const router = express.Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/google-auth", googleAuth)

router.get("/profile", authenticateToken, (req, res) => {
  res.send({ message: `Welcome, ${(req as any).user.username}` })
})

export default router
