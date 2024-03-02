import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany, JoinTable} from 'typeorm'
import { User } from './User'
import { Message } from './Message'

@Entity()
export class Conversation {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToMany(() => User)
    @JoinTable()
    users: User[];

    @OneToMany(() => Message, message => message.conversation)
    messages: Message[];
}

