import { define } from 'typeorm-seeding'
import { faker } from '@faker-js/faker'
import { UserRating } from '../../app/entities'

define(UserRating, () => {
  const userRating = new UserRating()
  userRating.score = faker.datatype.float({ min: 0, max: 10, precision: 1 })
  return userRating
})
