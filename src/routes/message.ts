import express from "express";
import authMiddleware from '../middleware/authMiddleware'
import { sendMessage, getMassagesByConversationId } from "../controllers/messageController";

const router = express.Router();

router.get("/:id", authMiddleware, getMassagesByConversationId);
router.post("/send/:id", authMiddleware, sendMessage);

export default router;