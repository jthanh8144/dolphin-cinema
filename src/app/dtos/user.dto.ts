import {
  IsNumber,
  IsOptional,
  IsEmail,
  IsPositive,
  IsString,
  IsInt,
  Min,
  Max,
} from 'class-validator'

export class CreateUserDto {
  @IsEmail()
  email: string

  @IsString()
  fullName: string
}

export class FindUserByEmailDto {
  @IsEmail()
  email: string
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName: string

  @IsOptional()
  @IsString()
  lastName: string

  @IsOptional()
  @IsNumber()
  @IsPositive()
  age: number
}

export class CreateUserRatingDto {
  @IsNumber()
  movie_id: number

  @IsInt()
  @Min(1)
  @Max(5)
  score: number
}
