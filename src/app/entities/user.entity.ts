import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm'
import { Comment, UserRating, UserTicket } from '.'

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  email: string

  @Column({ name: 'full_name' })
  fullName: string

  @Column({ type: 'date' })
  birthday: string

  @Column({ name: 'avatar_url' })
  avatarUrl: string

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date

  @DeleteDateColumn({
    name: 'deleted_at',
  })
  deletedAt: Date

  @OneToMany(() => UserRating, (userRating) => userRating.user)
  userRatings: UserRating[]

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[]

  @OneToMany(() => UserTicket, (userTicket) => userTicket.user)
  userTickets: UserTicket[]
}
