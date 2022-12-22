import { faker } from '@faker-js/faker'
import { define } from 'typeorm-seeding'
import { UserTicket } from '../../app/entities'

define(UserTicket, () => {
  const userTicket = new UserTicket()
  userTicket.totalPrice = faker.helpers.arrayElement([
    40000, 45000, 60000, 69000,
  ])
  return userTicket
})
