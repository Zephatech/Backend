
import { Response } from "express";
import Conversation from "../models/ConversaionModel";
import { AuthenticatedRequest } from "../types/authenticatedRequest";

export const getAllConversationsForCurrentUser = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user.userId;
        let conversations = await Conversation.findAllConversationWithUserId(userId);
        let transformedConverstaion = conversations.map(item => ({
            id: item.id,
            userId: item.users[0].id,
            firstName: item.users[0].firstName,
            lastName: item.users[0].lastName
        }))
        res.status(200).json(transformedConverstaion);
    } catch (error) {
        res.status(500).json({ message: "internal error" });
    }
}
