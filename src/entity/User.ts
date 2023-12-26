import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import myDataSource from '../config/dataSource'

@Entity()
export class User {
  private static userRepository = myDataSource.getRepository(User)

  static async findById(id) {
    return await this.userRepository.findOneBy({ id: id })
  }
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  firstName: string

  @Column()
  lastName: string

  @Column()
  email: string

  @Column()
  password: string

  @Column()
  verified: boolean

  @Column({ nullable: true })
  verificationCode: string

  @Column({ nullable: true })
  phoneNumber: string

  @Column({ nullable: true })
  facebookProfile: string

  @Column({ nullable: true })
  twitterProfile: string

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date
}
