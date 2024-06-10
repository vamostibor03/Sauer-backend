import mongoose, { Schema, Document } from "mongoose"

interface IChat extends Document {
  title: string
  messages: Array<{ sender: string; message: string }>
}

const ChatSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  messages: [
    {
      content: {
        type: String,
      },
      role: {
        type: String,
      },
      createAt: {
        type: Number,
      },
      parentId: {
        type: String,
      },
      updateAt: {
        type: Number,
      },
      extra: {
        fromModel: {
          type: String,
        },
      },
      id: {
        type: String,
      },
    },
  ],
})

const Chat = mongoose.model<IChat>("Chat", ChatSchema)

export default Chat
