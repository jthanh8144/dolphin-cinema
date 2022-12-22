import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm'
import { User, Ticket, Showtime } from '.'

@Entity({ name: 'user_tickets' })
export class UserTicket extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'total_price', type: 'decimal', precision: 7, scale: 1 })
  totalPrice: number

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

  @ManyToOne(() => User, (user) => user.userTickets)
  @JoinColumn({ name: 'user_id' })
  user: User

  @ManyToOne(() => Showtime, (showtime) => showtime.userTickets)
  @JoinColumn({ name: 'showtime_id' })
  showtime: Showtime

  @OneToMany(() => Ticket, (ticket) => ticket.userTicket)
  tickets: Ticket[]
}
