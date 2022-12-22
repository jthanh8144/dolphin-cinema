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
}
