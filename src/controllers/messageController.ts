import { Response } from "express";
import Conversation from "../models/ConversaionModel";
import Message from "../models/MessageModel";
import User from "../models/UserModel";
import { AuthenticatedRequest } from "../types/authenticatedRequest";
import { Conversation as ConverstaionEntity } from "../entity/Conversation";
import myDataSource from "../config/dataSource";

export const sendMessage = async (req: AuthenticatedRequest, res: Response) => {
    console.log("sendMessage controller");
	try {
        const senderId = req.user.userId;
		const { message } = req.body;
        const receiverId = req.params.id;
		
		let conversation : ConverstaionEntity  = await Conversation.findByUsers([senderId, receiverId]);
        const sender: User = await User.findById(senderId);
        const receiver: User = await User.findById(receiverId);
        if (!sender || !receiver) {
            return res.status(404).json({ message: "Invalid sender or receiver" });
        }

		if (!conversation) {
			conversation = await Conversation.create([sender, receiver]);
		}

		const newMessage = Message.createWithoutSave(senderId, receiverId, message, conversation.id);
        await myDataSource.manager.transaction(
            async transactionalEntityManager => {
                await transactionalEntityManager.save(newMessage);
                if (newMessage) {
                    conversation.messages.push(newMessage);
                }
                await transactionalEntityManager.save(conversation);
            }
        );
        
		res.status(201).json(newMessage);
	} catch (error) {
		console.log("Error in sendMessage controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getMassagesByConversationId = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const conversationId = req.params.id;
        const conversation = await Conversation.findById(conversationId);
        res.status(200).json(conversation.messages);
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: "internal error" });
    }
}