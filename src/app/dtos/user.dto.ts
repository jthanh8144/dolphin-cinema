import {
  IsNumber,
  IsOptional,
  IsEmail,
  IsPositive,
  IsString,
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
