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
import { TimeDurationTransformer } from '../../shared/column-transformer'

import { Showtime } from '.'

@Entity({ name: 'times' })
export class Time extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'tsrange', transformer: new TimeDurationTransformer() })
  time: string

  @Column({ type: 'text' })
  remark: string

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'NOW()',
  })
  createdAt: Date

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'NOW()',
    onUpdate: 'NOW()',
  })
  updatedAt: Date

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    nullable: true,
  })
  deletedAt: Date

  @OneToMany(() => Showtime, (showtime) => showtime.time)
  showtimes: Showtime[]
}
