import { IsNumber, IsString, IsOptional } from 'class-validator'
import { Type } from 'class-transformer'

export class ShowtimesDto {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  id: number

  @IsString()
  showDate: string

  @IsNumber()
  @Type(() => Number)
  timeId: number

  @IsNumber()
  @Type(() => Number)
  movieId: number

  @IsNumber()
  @Type(() => Number)
  cinemaRoomId: number
}
