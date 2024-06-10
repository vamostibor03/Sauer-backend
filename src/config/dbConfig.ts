import mongoose from "mongoose"

export const connectToDb = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/authDB",
      {
        serverSelectionTimeoutMS: 5000, // Optional: Adjust the timeout for server selection
      }
    )
    console.log("Connected to MongoDB")
  } catch (error) {
    console.error("Error connecting to MongoDB", error)
    process.exit(1)
  }
}
