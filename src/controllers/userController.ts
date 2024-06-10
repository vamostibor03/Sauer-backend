import { Request, Response } from "express"
import jwt from "jsonwebtoken"
import axios from "axios"
import User from "../models/userModel"
import dotenv from "dotenv"

dotenv.config()

const secret = process.env.JWT_SECRET || "secret"

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body
    const user = new User({ username, password })
    await user.save()
    res.status(201).send({ message: "User registered successfully" })
    const token = jwt.sign({ id: user._id, username: user.username }, secret, {
      expiresIn: "1h",
    })
  } catch (err) {
    console.log(err)
    res.status(400).send({ error: "Error registering user" })
  }
}

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body
    const user = await User.findOne({ username })

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).send({ error: "Invalid credentials" })
    }

    const token = jwt.sign({ id: user._id, username: user.username }, secret, {
      expiresIn: "1h",
    })

    res.send({
      message: "Logged in successfully",
      token,
      username: user.username,
    })
  } catch (err) {
    res.status(400).send({ error: "Error logging in" })
  }
}

const googleClientID = process.env.GOOGLE_CLIENT_ID || "your_google_client_id"
const googleClientSecret =
  process.env.GOOGLE_CLIENT_SECRET || "your_google_client_secret"

export const googleAuth = async (req: Request, res: Response) => {
  try {
    const { token } = req.body
    const googleTokenInfo = await axios.get(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`
    )

    const { email, name, sub: googleId } = googleTokenInfo.data

    let user = await User.findOne({ username: email })

    if (!user) {
      user = new User({ username: email, password: "google-auth", googleId })
      await user.save()
    } else {
      // Check for mismatched googleId, which can happen if the user signed up with another account using the same email
      if (user.googleId && user.googleId !== googleId) {
        return res
          .status(400)
          .send({ error: "User already exists with different Google ID" })
      }
    }

    const jwtToken = jwt.sign(
      { id: user._id, username: user.username },
      secret,
      {
        expiresIn: "1h",
      }
    )

    res.send({
      message: "Logged in successfully",
      token: jwtToken,
      username: name,
    })
  } catch (err) {
    res.status(400).send({ error: "Error authenticating with Google" })
  }
}
