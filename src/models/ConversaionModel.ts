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
            relations: ['messages', 'messages.sender', 'messages.receiver'],
            select: {
                id: true,
                messages: {
                    id: true,
                    content: true,
                    timestamp: true,
                    sender: {
                        id: true
                    },
                    receiver: {
                        id: true
                    }
                }
            }
        });
    }

    static async findByUsers(user1Id, user2Id) {
        const conversation = await this.conversationRepository
            .createQueryBuilder('conversation')
            .innerJoin('conversation.users', 'user')
            .where('user.id IN (:...userIds)', { userIds: [user1Id, user2Id] })
            .groupBy('conversation.id')
            .having('COUNT(conversation.id) = 2')
            .getOne();
        return conversation;
    }

    static async findAllConversationWithUserId(userId) {
        const conversations = await this.conversationRepository
        .createQueryBuilder("conversation")
        .innerJoin("conversation.users", "user")
        .innerJoin("conversation.users", "otherUser", "otherUser.id != :userId AND user.id = :userId", { userId })
        .select(["conversation.id", "otherUser.id", "otherUser.firstName", "otherUser.lastName"])
        .distinct(true) // Ensure distinct conversation IDs
        .getMany();

        return conversations;
    }
}

export default ConverstaionModel;