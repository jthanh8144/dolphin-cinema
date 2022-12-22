import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
  OneToMany,
} from 'typeorm'
import { CinemaSeat } from '.'
import { SeatTypeEnum } from '../../shared/constants'

@Entity({ name: 'seat_types' })
export class SeatType extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({ type: 'enum', enum: SeatTypeEnum })
  type: SeatTypeEnum

  @Column({ type: 'decimal', precision: 7, scale: 1 })
  surcharge: number

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

  @OneToMany(() => CinemaSeat, (cinemaSeat) => cinemaSeat.seatType)
  cinemaSeats: CinemaSeat[]
}
