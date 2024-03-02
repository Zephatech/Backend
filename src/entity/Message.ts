import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { User } from './User'
import { Conversation } from './Conversation';

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    timestamp: Date;

    @ManyToOne(() => User)
    @JoinColumn({name : "senderId"})
    sender: User;

    @ManyToOne(() => User)
    @JoinColumn({name : "receiverId"})
    receiver: User;

    @ManyToOne(() => Conversation)
    @JoinColumn({name : "conversationId"})
    conversation: Conversation;
}
