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

  // ----------------- for auto generate showtime today -----------------
  public getShowtimeTodayAndTomorrow() {
    const today = new Date()
    return this.createQueryBuilder('showtimes')
      .where('showtimes.showDate = :today')
      .andWhere('showtimes.showDate = :tomorrow')
      .setParameters({
        today,
        tomorrow: new Date(new Date().setDate(today.getDate() + 1)),
      })
      .getMany()
  }

  public async createShowtimeTodayAndTomorrow() {
    const showtimes = await Promise.all([
      this.findOne({ where: { id: 1 } }),
      this.findOne({ where: { id: 2 } }),
      this.findOne({ where: { id: 3 } }),
      this.findOne({ where: { id: 4 } }),
      this.findOne({ where: { id: 5 } }),
    ])
    if (
      showtimes[0] &&
      showtimes[1] &&
      showtimes[2] &&
      showtimes[3] &&
      showtimes[4]
    ) {
      const today = new Date()
      const tomorrow = new Date(new Date().setDate(today.getDate() + 1))
      showtimes[0].showDate = today.toLocaleDateString()
      showtimes[1].showDate = tomorrow.toLocaleDateString()
      showtimes[2].showDate = today.toLocaleDateString()
      showtimes[3].showDate = today.toLocaleDateString()
      showtimes[4].showDate = tomorrow.toLocaleDateString()
      await this.save(showtimes)
    }
  }
}
