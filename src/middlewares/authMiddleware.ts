import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

const secret = process.env.JWT_SECRET || "secret"

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"]?.split(" ")[1]

  if (!token) {
    return res.status(401).send({ error: "Unauthorized" })
  }

  try {
    const payload = jwt.verify(token, secret)
    ;(req as any).user = payload
    next()
  } catch (err) {
    res.status(403).send({ error: "Forbidden" })
  }
}
