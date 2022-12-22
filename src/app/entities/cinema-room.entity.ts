import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm'
import { Cinema, Showtime, CinemaSeat } from '.'

@Entity({ name: 'cinema_rooms' })
export class CinemaRoom extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

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

  @ManyToOne(() => Cinema, (cinema) => cinema.cinemaRooms)
  @JoinColumn({ name: 'cinema_id' })
  cinema: Cinema

  @OneToMany(() => Showtime, (showtime) => showtime.cinemaRoom)
  showtimes: Showtime[]

  @OneToMany(() => CinemaSeat, (cinemaSeat) => cinemaSeat.cinemaRoom)
  cinemaSeats: CinemaSeat[]
}
