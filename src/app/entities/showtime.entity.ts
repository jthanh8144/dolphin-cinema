import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Column,
  OneToMany,
} from 'typeorm'
import { CinemaRoom, Movie, Time, UserTicket } from '.'

@Entity({ name: 'showtimes' })
export class Showtime extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'show_date', type: 'date' })
  showDate: string

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

  @ManyToOne(() => CinemaRoom, (cinemaRoom) => cinemaRoom.showtimes)
  @JoinColumn({ name: 'cinema_room_id' })
  cinemaRoom: CinemaRoom

  @ManyToOne(() => Movie, (movie) => movie.showtimes)
  @JoinColumn({ name: 'movie_id' })
  movie: Movie

  @ManyToOne(() => Time, (time) => time.showtimes)
  @JoinColumn({ name: 'time_id' })
  time: Time

  @OneToMany(() => UserTicket, (userTicket) => userTicket.showtime)
  userTickets: UserTicket[]
}
