import { Showtime } from '@entities'
import dataSource from '@shared/configs/data-source.config'
import { Repository } from 'typeorm'

export class ShowtimeRepository extends Repository<Showtime> {
  constructor() {
    super(Showtime, dataSource.manager)
  }

  public getShowtimeById(id: number) {
    return this.createQueryBuilder('showtime')
      .leftJoinAndSelect('showtime.movie', 'movie')
      .leftJoinAndSelect('showtime.time', 'time')
      .leftJoinAndSelect('showtime.cinemaRoom', 'cinemaRoom')
      .leftJoinAndSelect('cinemaRoom.cinema', 'cinema')
      .select([
        'movie.name',
        'time.time',
        'showtime.id',
        'showtime.showDate',
        'cinemaRoom',
        'cinema.name',
      ])
      .where('showtime.id = :id')
      .setParameters({ id })
      .getOne()
  }

  public getShowtimesMovie({ movieId, locationId, date, cinemaId }) {
    const today = new Date().toLocaleDateString()
    const query = this.createQueryBuilder('showtimes')
      .leftJoinAndSelect('showtimes.cinemaRoom', 'cinemaRoom')
      .leftJoinAndSelect('cinemaRoom.cinema', 'cinema')
      .leftJoinAndSelect('cinema.location', 'location')
      .leftJoinAndSelect('showtimes.movie', 'movie')
      .leftJoinAndSelect('showtimes.time', 'time')
      .select([
        'showtimes.id',
        'cinemaRoom.name',
        'cinema.name',
        'movie.name',
        'showtimes.showDate',
        'time.time',
      ])
    if (cinemaId) {
      return query
        .andWhere('cinema.id = :cinemaId')
        .setParameters({ movieId, date, today, cinemaId })
        .orderBy('time.time', 'DESC')
        .getMany()
    }
    if (locationId) {
      return query
        .andWhere('location.id = :locationId')
        .setParameters({ movieId, date, today, locationId })
        .orderBy('time.time', 'DESC')
        .getMany()
    }
    return query.orderBy('showtimes.createdAt', 'DESC').getMany()
  }

  public getTimeById(id: number) {
    return this.findOne({ where: { id } })
  }
}
