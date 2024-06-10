import express from "express"
import userRoutes from "./routes/userRoutes"
import chatRoutes from "./routes/chatRoutes"
import threadsRoutes from "./routes/threadsRoutes"

import dotenv from "dotenv"
import mongoose from "mongoose"
import { connectToDb } from "./config/dbConfig"
import cors from "cors" // Import the cors middleware

dotenv.config()

const app = express()
app.use(express.json())
app.use(cors()) // Use the cors middleware to enable CORS
app.use("/api/users", userRoutes)
app.use("/api/chat", chatRoutes)
app.use("/api/threads", threadsRoutes)

connectToDb()

export default app
