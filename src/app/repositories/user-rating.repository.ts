import { UserRating } from '@entities'
import dataSource from '@shared/configs/data-source.config'
import { Repository } from 'typeorm'

export class UserRatingRepository extends Repository<UserRating> {
  constructor() {
    super(UserRating, dataSource.manager)
  }

  public checkUserRating(user_id: number, movie_id: number) {
    return this.createQueryBuilder('userRatings')
      .leftJoinAndSelect('userRatings.user', 'user')
      .leftJoinAndSelect('userRatings.movie', 'movie')
      .where('user.id = :user_id')
      .andWhere('movie.id = :movie_id')
      .setParameters({
        user_id: user_id,
        movie_id: movie_id,
      })
      .getOne()
  }

  public findRatingOfMovie(user_id: number, movie_id: number) {
    return this.createQueryBuilder('userRatings')
      .leftJoinAndSelect('userRatings.user', 'user')
      .leftJoinAndSelect('userRatings.movie', 'movie')
      .where('user.id = :id')
      .andWhere('movie.id = :movie_id')
      .setParameters({
        id: user_id,
        movie_id: movie_id,
      })
      .getOne()
  }
}
