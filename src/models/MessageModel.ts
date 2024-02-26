import { Message } from "../entity/Message";
import myDataSource from "../config/dataSource";

class MessageModel {
    private static messageRepository = myDataSource.getRepository(Message);

    static async create(senderId, receiverId, message, conversationId) {
        const newMessage = new Message();
        newMessage.sender = senderId;
        newMessage.receiver = receiverId;
        newMessage.content = message;
        newMessage.conversation = conversationId;

        return await this.messageRepository.save(newMessage);
    }

    static async createWithoutSave(senderId, receiverId, message, conversationId) {
        const newMessage = new Message();
        newMessage.sender = senderId;
        newMessage.receiver = receiverId;
        newMessage.content = message;
        newMessage.conversation = conversationId;

        return newMessage;
    }

    static async findByConversationId(conversationId) {
        return await this.messageRepository.find({
            where: { conversation: conversationId },
        });
    }
}

export default MessageModel;