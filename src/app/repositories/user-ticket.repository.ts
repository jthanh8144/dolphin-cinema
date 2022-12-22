import { UserTicket } from '@entities'
import dataSource from '@shared/configs/data-source.config'
import { Repository } from 'typeorm'

export class UserTicketRepository extends Repository<UserTicket> {
  constructor() {
    super(UserTicket, dataSource.manager)
  }

  private queryGetUserTicket() {
    return this.createQueryBuilder('userTicket')
      .leftJoinAndSelect('userTicket.user', 'user')
      .leftJoinAndSelect('userTicket.showtime', 'showtime')
      .leftJoinAndSelect('showtime.time', 'time')
      .leftJoinAndSelect('showtime.cinemaRoom', 'cinemaRoom')
      .leftJoinAndSelect('cinemaRoom.cinema', 'cinema')
      .leftJoinAndSelect('showtime.movie', 'movie')
      .leftJoinAndSelect('userTicket.tickets', 'tickets')
      .leftJoinAndSelect('tickets.cinemaSeat', 'cinemaSeat')
      .leftJoinAndSelect('cinemaSeat.seat', 'seat')
      .select([
        'userTicket.id',
        'userTicket.totalPrice',
        'user.id',
        'showtime.showDate',
        'time.time',
        'cinemaRoom.name',
        'cinema.name',
        'showtime.movie',
        'movie.name',
        'movie.image',
        'tickets.id',
        'cinemaSeat.id',
        'seat.row',
        'seat.column',
      ])
  }

  public getUserTicketById(id: number) {
    return this.queryGetUserTicket()
      .where('userTicket.id = :id')
      .orderBy('seat.row')
      .addOrderBy('seat.column')
      .setParameters({ id })
      .getOne()
  }

  public getTicketsOfUser(userId: number) {
    return this.queryGetUserTicket()
      .where('user.id = :userId')
      .orderBy('seat.row')
      .addOrderBy('seat.column')
      .setParameters({ userId })
      .getMany()
  }
}
