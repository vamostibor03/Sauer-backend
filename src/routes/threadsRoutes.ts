import express from "express"
import {
  createChatThread,
  deleteChatThreadById,
  getAllChatThreads,
  getChatThreadById,
  updateChatThreadById,
} from "../controllers/threadsController"

const router = express.Router()

router.route("/").post(createChatThread).get(getAllChatThreads)
router
  .route("/:id")
  .get(getChatThreadById)
  .post(updateChatThreadById)
  .delete(deleteChatThreadById)
export default router
