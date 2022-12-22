import { faker } from '@faker-js/faker'
import { define } from 'typeorm-seeding'
import { Showtime } from '../../app/entities'

define(Showtime, () => {
  const st = new Showtime()
  st.showDate = faker.date.recent().toISOString()
  return st
})
