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
import { UserRating, Comment, Showtime } from '.'
import { RoundTransformer } from '../../shared/column-transformer'

@Entity({ name: 'movies' })
export class Movie extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  description: string

  @Column()
  image: string

  @Column({ name: 'trailer_url' })
  trailerUrl: string

  @Column({
    name: 'review_score',
    transformer: new RoundTransformer(),
  })
  reviewScore: number

  @Column({ name: 'release_date' })
  releaseDate: Date

  @Column({ name: 'showtime_duration' })
  showtimeDuration: number

  @Column()
  writer: string

  @Column()
  director: string

  @Column()
  language: string

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

  @OneToMany(() => UserRating, (userRating) => userRating.movie)
  userRatings: UserRating[]

  @OneToMany(() => Comment, (comment) => comment.movie)
  comments: Comment[]

  @OneToMany(() => Showtime, (showtime) => showtime.movie)
  showtimes: Showtime[]
}
