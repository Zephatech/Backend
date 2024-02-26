import express from "express";
import authMiddleware from '../middleware/authMiddleware'
import { getAllConversationsForCurrentUser } from "../controllers/conversationController";

const router = express.Router();
router.get("/", authMiddleware, getAllConversationsForCurrentUser);

export default router;