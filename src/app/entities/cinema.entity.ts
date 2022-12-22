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
import { CinemaRoom, Location } from '.'

@Entity({ name: 'cinemas' })
export class Cinema extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({ type: 'text', nullable: true })
  description: string

  @Column({ name: 'base_price' })
  basePrice: number

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

  @ManyToOne(() => Location, (location) => location.cinemas)
  @JoinColumn({ name: 'location_id' })
  location: Location

  @OneToMany(() => CinemaRoom, (cinemaRoom) => cinemaRoom.cinema)
  cinemaRooms: CinemaRoom[]
}
