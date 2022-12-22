import { define } from 'typeorm-seeding'
import { faker } from '@faker-js/faker'
import { Seat } from '../../app/entities'
import { SeatRow } from '../../shared/constants'

define(Seat, () => {
  const seat = new Seat()
  const seatRowKeys = Object.keys(SeatRow) as (keyof typeof SeatRow)[]
  seat.row =
    SeatRow[seatRowKeys[Math.floor(Math.random() * seatRowKeys.length)]]
  seat.column = faker.datatype.number({ min: 1, max: 20 })
  return seat
})
