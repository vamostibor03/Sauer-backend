import { ChatOpenAI } from "langchain/chat_models/openai"
import { BytesOutputParser } from "langchain/schema/output_parser"
import { PromptTemplate } from "langchain/prompts"
import { Request, Response } from "express"
import {
  HumanMessage,
  SystemMessage,
  AIMessage,
  BaseMessage,
} from "@langchain/core/messages"

export const inference = async (req: Request, res: Response) => {
  try {
    // Log the request body
    console.log("Request body:", req.body)

    // START CHANGING STUFF HERE

    // for example, add RAG (using langchain)

    const systemPrompt = new SystemMessage(`
      Du bist ein Chatbot für die Fahrschule Sauer (sauer.at). Deine Aufgabe ist es, Fragen zu den angebotenen Kursen, den Partnern der Fahrschule und den verschiedenen Führerscheinklassen zu beantworten. Zudem sollst du Interessenten ermutigen, sich für Kurse bei der Fahrschule Sauer anzumelden.

Hier sind einige Punkte, die du beachten solltest:

-Biete klare und präzise Informationen zu den verfügbaren Kursen, deren Inhalte und Zeitplänen.
-Informiere über die Partner der Fahrschule und die Vorteile dieser Partnerschaften.
-Erkläre die verschiedenen Führerscheinklassen und deren Anforderungen.
-Motiviere und ermutige Interessenten, sich für Kurse anzumelden, indem du auf die Vorteile der Fahrschule Sauer hinweist.
-Sei freundlich, hilfsbereit und unterstützend in deinen Antworten.
      `);

    const body = await req.body
    const messages = [
      systemPrompt, ...(body.messages ?? [])?.map((message: any) => {
        return message.role === "system"
          ? new SystemMessage(message.content)
          : message.role === "user"
          ? new HumanMessage(message.content)
          : new AIMessage(message.content)
      })
    ]

    console.log("Messages: " + messages);
    const model = new ChatOpenAI({
      streaming: true,
    })

    const outputParser = new BytesOutputParser()

    const chain = model.pipe(outputParser)

    // STOP CHAGNING STUFF HERE

    // Set the headers to keep the connection open for streaming
    res.setHeader("Content-Type", "text/event-stream")
    res.setHeader("Cache-Control", "no-cache")
    res.setHeader("Connection", "keep-alive")

    // Define a handler to send data to the client
    const sendTokenToClient = (token: string) => {
      // res.write(`data: ${token}\n\n`)
      res.write(`${token}`)
    }

    await chain.invoke(messages, {
      callbacks: [
        {
          handleLLMNewToken(token: string) {
            console.log("New token:", token)
            sendTokenToClient(token)
          },
        },
      ],
    })

    res.end()
  } catch (error) {
    // Log any errors
    console.error("Error occurred:", error)
    // Return an error response
    return res.status(500).json({ error: "Internal Server Error" })
  }
}
