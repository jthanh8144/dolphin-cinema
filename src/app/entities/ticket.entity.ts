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
} from 'typeorm'
import { CinemaSeat, UserTicket } from '.'

@Entity({ name: 'tickets' })
export class Ticket extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'decimal', precision: 7, scale: 1 })
  price: number

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

  @ManyToOne(() => UserTicket, (userTicket) => userTicket.tickets)
  @JoinColumn({ name: 'user_ticket_id' })
  userTicket: UserTicket

  @ManyToOne(() => CinemaSeat, (cinemaSeat) => cinemaSeat.tickets)
  @JoinColumn({ name: 'cinema_seat_id' })
  cinemaSeat: CinemaSeat
}
