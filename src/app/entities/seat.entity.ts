import { Max } from 'class-validator'
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
import { CinemaSeat } from '.'
import { SeatRow } from '../../shared/constants'

@Entity({ name: 'seats' })
export class Seat extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'enum', enum: SeatRow })
  row: SeatRow

  @Column({ type: 'smallint' })
  @Max(20)
  column: number

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

  @OneToMany(() => CinemaSeat, (cinemaSeat) => cinemaSeat.seat)
  cinemaSeats: CinemaSeat[]
}
