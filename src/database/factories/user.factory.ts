import { define } from 'typeorm-seeding'
import { faker } from '@faker-js/faker'
import { User } from '../../app/entities'

define(User, () => {
  const user = new User()
  user.email = faker.internet.email()
  user.fullName = faker.name.firstName() + ' ' + faker.name.lastName()
  user.birthday = faker.date.birthdate({ min: 15, max: 60 }).toISOString()
  user.avatarUrl = faker.image.avatar()
  return user
})
