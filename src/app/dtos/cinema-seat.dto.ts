import { IsNumber } from 'class-validator'
import { Type } from 'class-transformer'

export class CinemaSeatDto {
  @IsNumber()
  @Type(() => Number)
  cinemaRoomId: number

  @IsNumber()
  @Type(() => Number)
  seatId: number

  @IsNumber()
  @Type(() => Number)
  seatTypeId: number
}
