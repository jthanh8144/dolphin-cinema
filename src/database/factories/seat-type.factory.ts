import { define } from 'typeorm-seeding'
import { faker } from '@faker-js/faker'
import { SeatType } from '../../app/entities'
import { SeatTypeEnum } from '../../shared/constants'

define(SeatType, () => {
  const st = new SeatType()
  st.name = 'Seat ' + faker.name.suffix()
  const seatRowKeys = Object.keys(SeatTypeEnum) as (keyof typeof SeatTypeEnum)[]
  st.type =
    SeatTypeEnum[seatRowKeys[Math.floor(Math.random() * seatRowKeys.length)]]
  return st
})
