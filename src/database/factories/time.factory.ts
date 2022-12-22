import { define } from 'typeorm-seeding'
import { faker } from '@faker-js/faker'
import { Time } from '../../app/entities'

define(Time, () => {
  const time = new Time()
  const randomNumber = faker.datatype.number({ min: 2, max: 22 })
  time.time = `[2022-01-01 ${randomNumber.toString()}:00, 2022-01-01 ${(
    randomNumber + 1
  ).toString()}:30)`
  time.remark = 'Time ' + faker.name.suffix()
  return time
})
