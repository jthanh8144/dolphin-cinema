import { define } from 'typeorm-seeding'
import { faker } from '@faker-js/faker'
import { Cinema } from '../../app/entities'

define(Cinema, () => {
  const cinema = new Cinema()
  cinema.name = 'Rap ' + faker.name.suffix()
  cinema.description = cinema.name + ' description'
  cinema.basePrice = faker.helpers.arrayElement([40000, 45000, 60000, 69000])
  return cinema
})
