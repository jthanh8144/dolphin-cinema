import { Max, Min } from 'class-validator'
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
import { User, Movie } from '.'

@Entity({ name: 'user_ratings' })
export class UserRating extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'smallint' })
  @Min(1)
  @Max(5)
  score: number

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

  @ManyToOne(() => User, (user) => user.userRatings)
  @JoinColumn({ name: 'user_id' })
  user: User

  @ManyToOne(() => Movie, (movie) => movie.userRatings)
  @JoinColumn({ name: 'movie_id' })
  movie: Movie
}
