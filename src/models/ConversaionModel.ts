import { Conversation } from "../entity/Conversation";
import myDataSource from "../config/dataSource";

class ConverstaionModel {
    private static conversationRepository = myDataSource.getRepository(Conversation);

    static async create(users) {
        const conversation = new Conversation();
        conversation.users = users;
        return await this.conversationRepository.save(conversation);
    }

    static async findById(id) {
        return await this.conversationRepository.findOne({
            where: { id },
            relations: ['messages', 'messages.sender'],
            select: {
                id: true,
                messages: {
                    id: true,
                    content: true,
                    sender: {
                        id: true
                    },
                    timestamp: true
                }
            }
        });
    }

    static async findByUserId(userId) {
        return await this.conversationRepository.find({
            where: { users: userId },
        });
    }

    static async findByUsers(users) {
        const conversations = await this.conversationRepository.findOne({
            relations: ['users', 'messages'],
            where: {
                users: users.map(user => user.id)
            }
        });
        return conversations;
    }

    static async findAllConversationWithUsers(userId) {
        const conversations = await this.conversationRepository
            .createQueryBuilder("conversation")
            .leftJoinAndSelect("conversation.users", "user")
            .where("user.id != :userId", { userId })
            .select(["conversation.id", "user.id", "user.firstName", "user.lastName"])
            .getMany();

        return conversations;
    }
}

export default ConverstaionModel;