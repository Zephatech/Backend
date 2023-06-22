import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";
import { Product } from "./Product";

@Entity()
export class Trade {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "buyerId" })
  buyer: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: "sellerId" })
  seller: User;

  @ManyToOne(() => Product)
  @JoinColumn({ name: "productId" })
  product: Product;

  @Column({ default: false })
  confirmed: boolean;

  @Column({ nullable: true })
  confirmedAt: Date;

  @Column({ nullable: true })
  canceledAt: Date;

  @Column({ nullable: true })
  endedAt: Date;
}