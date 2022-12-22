import { Movie } from '@entities'
import dataSource from '@shared/configs/data-source.config'
import { Repository } from 'typeorm'
import { LIMIT_MOVIES } from '@shared/constants'

export class MovieRepository extends Repository<Movie> {
  constructor() {
    super(Movie, dataSource.manager)
  }

  private queryCountRating() {
    return this.createQueryBuilder('movies').loadRelationCountAndMap(
      'movies.countRatings',
      'movies.userRatings',
    )
  }

  public getDetailMovieData(movieId: number) {
    return this.createQueryBuilder('movie')
      .leftJoinAndSelect('movie.showtimes', 'showtime')
      .leftJoinAndSelect('showtime.time', 'times')
      .leftJoinAndSelect('showtime.cinemaRoom', 'cinemaRooms')
      .leftJoinAndSelect('cinemaRooms.cinema', 'cinema')
      .leftJoinAndSelect('cinema.location', 'locations')
      .where('movie.id = :id')
      .setParameters({
        id: movieId,
      })
      .getOne()
  }

  public getAllMovie() {
    return this.queryCountRating().getMany()
  }

  public getLatestMovies() {
    return this.queryCountRating()
      .leftJoinAndSelect('movies.showtimes', 'showtimes')
      .where('showtimes.showDate <= :today')
      .andWhere('movies.releaseDate <= :today')
      .setParameters({ today: new Date() })
      .limit(LIMIT_MOVIES)
      .getMany()
  }

  public getTopRateMovies() {
    return this.queryCountRating()
      .leftJoinAndSelect('movies.showtimes', 'showtimes')
      .where('showtimes.showDate <= :today')
      .setParameters({ today: new Date() })
      .orderBy('movies.reviewScore', 'DESC')
      .limit(LIMIT_MOVIES)
      .getMany()
  }

  public getComingSoonMovies() {
    const today = new Date()
    return this.queryCountRating()
      .where('movies.releaseDate > :startDay')
      .andWhere('movies.releaseDate <= :endDay')
      .setParameters({
        startDay: new Date(),
        endDay: new Date(new Date().setDate(today.getDate() + 14)),
      })
      .orderBy('movies.releaseDate', 'ASC')
      .limit(LIMIT_MOVIES)
      .getMany()
  }

  public getMovieById(id: number) {
    return this.findOne({ where: { id } })
  }
}
