import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    ownerId: number
    
    @Column()
    name: string

    @Column()
    price: number

    @Column()
    description: string

    @Column()
    category: string

    @Column()
    image: string

    @Column({ default: false })
    locked: boolean;
  
    @Column({ nullable: true })
    lockedAt: Date;
}
