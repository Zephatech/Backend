import { Response } from "express";
import myDataSource from "../config/dataSource";
import Conversation from "../models/ConversaionModel";
import Message from "../models/MessageModel";
import User from "../models/UserModel";
import { User as UserEntity } from "../entity/User";
import { Conversation as ConversationEntity } from "../entity/Conversation";
import { AuthenticatedRequest } from "../types/authenticatedRequest";

async function _findOrCreateConversation(user1: UserEntity, user2: UserEntity): Promise<ConversationEntity> {
    const user1Id = user1.id;
    const user2Id = user2.id;

    const existingConversation = await Conversation.findByUsers(user1Id, user2Id);
    if (existingConversation) {
        return existingConversation;
    } else {
        return await Conversation.create([user1, user2]);
    }
}

export const sendMessage = async (req: AuthenticatedRequest, res: Response) => {
	try {
        const message = req.body?.message;
        if( !message || message.length === 0) {
            return res.status(400).json({ message: "Invalid message" });
        }

        const senderId = req.user.userId;
        const receiverId = req.params.id;
        
        const [sender, receiver] = await Promise.all([
            User.findById(senderId),
            User.findById(receiverId)
        ]);

        if (!sender || !receiver || sender.id === receiver.id) {
            return res.status(404).json({ message: "Invalid sender or receiver" });
        }
        
        let conversationId = (await _findOrCreateConversation(sender, receiver)).id;
        let conversation = await Conversation.findById(conversationId);

		const newMessage = Message.createWithoutSave(senderId, receiverId, message, conversation.id);
        await myDataSource.manager.transaction(
            async transactionalEntityManager => {
                await transactionalEntityManager.save(newMessage);
                conversation.messages.push(newMessage);
                await transactionalEntityManager.save(conversation);
            }
        );

        // TODO：optimize this part
        const conversationNew = await Conversation.findById(conversationId);

        res.status(200).json(conversationNew.messages);
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