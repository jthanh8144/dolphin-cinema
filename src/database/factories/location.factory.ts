import { define } from 'typeorm-seeding'
import { faker } from '@faker-js/faker'
import { Location } from '../../app/entities'

define(Location, () => {
  const location = new Location()
  location.name = faker.address.cityName()
  return location
})
