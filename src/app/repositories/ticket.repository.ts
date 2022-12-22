import { Ticket } from '@entities'
import dataSource from '@shared/configs/data-source.config'
import { Repository } from 'typeorm'

export class TicketRepository extends Repository<Ticket> {
  constructor() {
    super(Ticket, dataSource.manager)
  }
}
