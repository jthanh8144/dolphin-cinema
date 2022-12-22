import { IsString, IsNumber, IsPositive } from 'class-validator'
import { Type } from 'class-transformer'

export class CinemaDto {
  @IsString()
  name: string

  @IsString()
  description: string

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  basePrice: number

  @IsNumber()
  @Type(() => Number)
  locationId: number
}
