import { define } from 'typeorm-seeding'
import { faker } from '@faker-js/faker'
import { CinemaRoom } from '../../app/entities'

define(CinemaRoom, () => {
  const cinemaRoom = new CinemaRoom()
  cinemaRoom.name = faker.name.firstName()
  return cinemaRoom
})
