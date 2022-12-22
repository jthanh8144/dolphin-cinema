import { Seat } from '@entities'
import dataSource from '@shared/configs/data-source.config'
import { Repository } from 'typeorm'

export class SeatRepository extends Repository<Seat> {
  constructor() {
    super(Seat, dataSource.manager)
  }

  private queryGetSeats() {
    return this.createQueryBuilder('seat')
      .leftJoinAndSelect('seat.cinemaSeats', 'cinemaSeats')
      .leftJoinAndSelect('cinemaSeats.cinemaRoom', 'cinemaRoom')
      .leftJoinAndSelect('cinemaRoom.showtimes', 'showtimes')
  }

  public async getAllSeatsByShowtimeId(id: number) {
    const unavailableSeats = await this.queryGetSeats()
      .leftJoinAndSelect('cinemaSeats.tickets', 'tickets')
      .leftJoinAndSelect('tickets.userTicket', 'userTicket')
      .leftJoinAndSelect('userTicket.showtime', 'showtime')
      .select([
        'seat.id',
        'seat.row',
        'seat.column',
        'cinemaSeats.id',
        'tickets.id',
      ])
      .where('showtimes.id = :id')
      .andWhere('showtime.id = :id')
      .andWhere('userTicket.deletedAt IS NULL')
      .setParameters({ id })
      .orderBy('seat.row')
      .addOrderBy('seat.column')
      .getMany()
    const seats = await this.queryGetSeats()
      .leftJoinAndSelect('cinemaSeats.seatType', 'seatType')
      .leftJoinAndSelect('cinemaRoom.cinema', 'cinema')
      .select([
        'seat.id',
        'seat.row',
        'seat.column',
        'cinemaSeats.id',
        'cinemaRoom.id',
        'cinema.basePrice',
        'seatType.surcharge',
      ])
      .where('showtimes.id = :id')
      .setParameters({ id })
      .orderBy('seat.row')
      .addOrderBy('seat.column')
      .getMany()
    unavailableSeats.forEach((seat) => {
      const index = seats.findIndex((item) => item.id === seat.id)
      seats[index].cinemaSeats[0].tickets = seat.cinemaSeats[0].tickets
    })
    return seats.reduce((previous, currentItem) => {
      const group = currentItem['row']
      if (!previous[group]) previous[group] = []
      currentItem['cinemaSeatId'] = currentItem.cinemaSeats[0].id
      currentItem['price'] =
        +currentItem.cinemaSeats[0].seatType.surcharge +
        +currentItem.cinemaSeats[0].cinemaRoom.cinema.basePrice
      if (currentItem.cinemaSeats[0].tickets) {
        currentItem['ticket'] = currentItem.cinemaSeats[0].tickets[0].id
      }
      delete currentItem.cinemaSeats
      previous[group].push(currentItem)
      return previous
    }, {})
  }

  public getAllSeats() {
    return this.find({ order: { row: 'ASC', column: 'ASC' } })
  }

  public getSeatById(id: number) {
    return this.findOne({ where: { id } })
  }
}
