import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm'
import { Seat, SeatType, CinemaRoom, Ticket } from '.'

@Entity({ name: 'cinema_seats' })
export class CinemaSeat extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

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

  @ManyToOne(() => Seat, (seat) => seat.cinemaSeats)
  @JoinColumn({ name: 'seat_id' })
  seat: Seat

  @ManyToOne(() => SeatType, (seatType) => seatType.cinemaSeats)
  @JoinColumn({ name: 'seat_type_id' })
  seatType: SeatType

  @ManyToOne(() => CinemaRoom, (cinemaRoom) => cinemaRoom.cinemaSeats)
  @JoinColumn({ name: 'cinema_room_id' })
  cinemaRoom: CinemaRoom

  @OneToMany(() => Ticket, (ticket) => ticket.cinemaSeat)
  tickets: Ticket[]
}
