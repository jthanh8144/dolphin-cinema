import { Movie } from '@entities'
import dataSource from '@shared/configs/data-source.config'
import { Repository, ILike } from 'typeorm'
import { LIMIT_MOVIES, LIMIT_SEARCH } from '@shared/constants'

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

  public getSearchResult(type: string, value: string, page = 1) {
    const offset = (page - 1) * LIMIT_SEARCH
    let query = null
    if (type === 'all') {
      query = this.queryCountRating()
        .where('movies.name ilike :value')
        .orWhere('movies.director ilike :value')
        .orWhere('movies.writer ilike :value')
    } else {
      query = this.queryCountRating().where(`movies.${type} ilike :value`)
    }
    query
      .setParameters({ value: `%${value}%` })
      .limit(LIMIT_SEARCH)
      .offset(offset)
    return query.getMany()
  }

  public async countPages(type: string, value: string) {
    const options = { where: [] }
    if (type === 'all') {
      options.where.push(
        { name: ILike(`%${value}%`) },
        { director: ILike(`%${value}%`) },
        { writer: ILike(`%${value}%`) },
      )
    } else {
      options.where.push({ [type]: ILike(`%${value}%`) })
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, count] = await this.findAndCount(options)
    return {
      countPage: Math.ceil(count / LIMIT_SEARCH),
      totalItem: count,
    }
  }

  public getTotalCommentAndRatingOfMovieById(movie_id: number) {
    return this.createQueryBuilder('movie')
      .loadRelationCountAndMap('movie.countRatings', 'movie.userRatings')
      .loadRelationCountAndMap('movie.countComments', 'movie.comments')
      .where('movie.id = :id')
      .setParameters({
        id: movie_id,
      })
      .getOne()
  }

  public getAllRatingOfMovieById(movieId: number) {
    return this.createQueryBuilder('movie')
      .loadRelationCountAndMap('movie.countRatings', 'movie.userRatings')
      .leftJoinAndSelect('movie.userRatings', 'userRatings')
      .where('movie.id = :id')
      .setParameters({
        id: movieId,
      })
      .getOne()
  }

  public async generateComingSoonMovie() {
    const movies = await Promise.all([
      this.findOne({ where: { id: 3 } }),
      this.findOne({ where: { id: 4 } }),
      this.findOne({ where: { id: 5 } }),
      this.findOne({ where: { id: 6 } }),
    ])
    if (movies[0] && movies[1] && movies[2] && movies[3]) {
      const today = new Date()
      movies[0].releaseDate = new Date(new Date().setDate(today.getDate() + 1))
      movies[1].releaseDate = new Date(new Date().setDate(today.getDate() + 2))
      movies[2].releaseDate = new Date(new Date().setDate(today.getDate() + 3))
      movies[3].releaseDate = new Date(new Date().setDate(today.getDate() + 4))
      await this.save(movies)
    }
  }
}
