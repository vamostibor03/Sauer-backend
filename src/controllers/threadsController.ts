import { Request, Response } from "express"
import Chat from "../models/chatModel" // assuming the model file is named `chatModel.ts`

// Create a new chat thread
export const createChatThread = async (req: Request, res: Response) => {
  try {
    const { title } = req.body
    const chat = new Chat({ title, messages: [] })
    await chat.save()
    res.status(201).send(chat)
  } catch (err) {
    console.error(err)
    res.status(400).send({ error: "Error creating chat thread" })
  }
}

// Get all chat threads
export const getAllChatThreads = async (req: Request, res: Response) => {
  try {
    const threads = await Chat.find({})
    res.send(threads)
  } catch (err) {
    console.error(err)
    res.status(400).send({ error: "Error fetching chat threads" })
  }
}

// Get a specific chat thread by ID
export const getChatThreadById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const chat = await Chat.findById(id)
    if (!chat) {
      return res.status(404).send({ error: "Chat thread not found" })
    }
    res.send(chat)
  } catch (err) {
    console.error(err)
    res.status(400).send({ error: "Error fetching chat thread" })
  }
}

// Update a specific chat thread by ID
export const updateChatThreadById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { messages } = req.body
    const chat = await Chat.findByIdAndUpdate(
      id,
      { messages },
      { new: true, runValidators: true }
    )
    if (!chat) {
      return res.status(404).send({ error: "Chat thread not found" })
    }
    res.send(chat)
  } catch (err) {
    console.error(err)
    res.status(400).send({ error: "Error updating chat thread" })
  }
}

// Delete a specific chat thread by ID
export const deleteChatThreadById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const chat = await Chat.findByIdAndDelete(id)
    if (!chat) {
      return res.status(404).send({ error: "Chat thread not found" })
    }
    res.send({ message: "Chat thread deleted successfully" })
  } catch (err) {
    console.error(err)
    res.status(400).send({ error: "Error deleting chat thread" })
  }
}
