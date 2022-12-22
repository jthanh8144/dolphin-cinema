import {
  ShowtimeRepository,
  UserTicketRepository,
  TicketRepository,
  CinemaSeatRepository,
} from '@repositories'
import { Ticket, User, UserTicket } from '@entities'
import dataSource from '@shared/configs/data-source.config'
import { socket } from '@shared/providers'

class BookingService {
  private userTicketRepository: UserTicketRepository
  private showtimeRepository: ShowtimeRepository
  private ticketRepository: TicketRepository
  private cinemaSeatRepository: CinemaSeatRepository

  constructor() {
    this.userTicketRepository = new UserTicketRepository()
    this.showtimeRepository = new ShowtimeRepository()
    this.ticketRepository = new TicketRepository()
    this.cinemaSeatRepository = new CinemaSeatRepository()
  }

  public async saveBooking(
    user: User,
    cinemaSeatsId: number[],
    showtimeId: number,
  ) {
    const queryRunner = dataSource.createQueryRunner()
    queryRunner.connect()

    const userTicketData = new UserTicket()
    userTicketData.user = user
    userTicketData.showtime = await this.showtimeRepository.findOne({
      where: { id: showtimeId },
    })
    userTicketData.totalPrice =
      await this.cinemaSeatRepository.calculateTotalPrice(cinemaSeatsId)
    const userTicket = this.userTicketRepository.create(userTicketData)
    await queryRunner.startTransaction()
    try {
      await queryRunner.manager.save(userTicket)
      cinemaSeatsId.forEach(async (id: number) => {
        const ticket = new Ticket()
        ticket.userTicket = userTicket
        ticket.cinemaSeat = await this.cinemaSeatRepository.findOne({
          where: { id },
        })
        ticket.price = await this.cinemaSeatRepository.calculatePriceOfTicket(
          id,
        )
        await queryRunner.manager.save(this.ticketRepository.create(ticket))
      })
      await queryRunner.commitTransaction()
      socket.emit('data', cinemaSeatsId)
      return userTicket
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw error
    }
  }
}
export const bookingService = new BookingService()
