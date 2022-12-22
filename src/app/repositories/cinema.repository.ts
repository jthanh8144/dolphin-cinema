import { Cinema } from '@entities'
import dataSource from '@shared/configs/data-source.config'
import { Repository } from 'typeorm'

export class CinemaRepository extends Repository<Cinema> {
  constructor() {
    super(Cinema, dataSource.manager)
  }

  public getShowtimesOfMovie({ movieId, locationId, date, cinemaId }) {
    const today = new Date().toLocaleDateString()
    const query = this.createQueryBuilder('cinemas')
      .leftJoinAndSelect('cinemas.cinemaRooms', 'cinemaRooms')
      .leftJoinAndSelect('cinemaRooms.showtimes', 'showtimes')
      .leftJoinAndSelect('cinemaRooms.cinema', 'cinema')
      .leftJoinAndSelect('cinema.location', 'location')
      .leftJoinAndSelect('showtimes.movie', 'movie')
      .leftJoinAndSelect('showtimes.time', 'time')
      .select(['cinemas.name', 'cinemaRooms', 'showtimes', 'time'])
      .where('movie.id = :movieId')
      .andWhere('showtimes.showDate = :date')
      .andWhere('showtimes.showDate >= :today')
    if (cinemaId) {
      return query
        .andWhere('cinema.id = :cinemaId')
        .setParameters({ movieId, date, today, cinemaId })
        .orderBy('time.time', 'ASC')
        .getMany()
    }
    if (locationId) {
      return query
        .andWhere('location.id = :locationId')
        .setParameters({ movieId, date, today, locationId })
        .orderBy('time.time', 'ASC')
        .getMany()
    }
    return query
      .setParameters({ movieId, date, today })
      .orderBy('time.time', 'ASC')
      .getMany()
  }

  public getAllCinemas() {
    return this.find({
      select: ['id', 'name'],
    })
  }

  public getCinemaById(id: number) {
    return this.findOne({
      select: ['id', 'name', 'description', 'basePrice', 'location'],
      relations: ['location'],
      where: { id },
    })
  }

  public getAllCinemasWithRelation() {
    return this.find({
      select: ['id', 'name', 'basePrice', 'location'],
      relations: ['location'],
      order: {
        location: {
          name: 'ASC',
        },
        name: 'ASC',
      },
    })
  }
}
