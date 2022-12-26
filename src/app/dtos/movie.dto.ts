import { IsString, IsNumber, IsOptional, IsDate } from 'class-validator'
import { Type } from 'class-transformer'

export class MovieDto {
  @IsString()
  @IsOptional()
  name: string

  @IsString()
  @IsOptional()
  description: string

  @IsString()
  @IsOptional()
  trailerUrl: string

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  reviewScore: number

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  releaseDate: Date

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  showtimeDuration: number

  @IsString()
  @IsOptional()
  writer: string

  @IsString()
  @IsOptional()
  director: string

  @IsString()
  @IsOptional()
  language: string
}
