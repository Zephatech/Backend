import express from "express";
import authMiddleware from '../middleware/authMiddleware'
import { getAllConversations } from "../controllers/conversationController";

const router = express.Router();
router.get("/", authMiddleware, getAllConversations);


export default router;