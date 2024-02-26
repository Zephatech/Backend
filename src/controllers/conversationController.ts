
import { Response } from "express";
import Conversation from "../models/ConversaionModel";
import { AuthenticatedRequest } from "../types/authenticatedRequest";

export const getAllConversations = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user.userId;
        const conversations = await Conversation.findAllConversationWithUsers(userId);
        
        res.status(200).json(conversations);
    } catch (error) {
        res.status(500).json({ message: "internal error" });
    }
}
