import { define } from 'typeorm-seeding'
import { faker } from '@faker-js/faker'
import { Ticket } from '../../app/entities'

define(Ticket, () => {
  const ticket = new Ticket()
  ticket.price = faker.helpers.arrayElement([40000, 45000, 60000, 69000])
  return ticket
})
