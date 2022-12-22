import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm'
import { AdminRole } from '../../shared/constants'

@Entity({ name: 'admins' })
export class Admin extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  email: string

  @Column({ name: 'full_name' })
  fullName: string

  @Column({ name: 'avatar_url' })
  avatarUrl: string

  @Column({ type: 'enum', enum: AdminRole })
  role: AdminRole

  @Column({ name: 'is_default_password' })
  isDefaultPassword: boolean

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
}
