import { IsEmail, IsString, IsEnum, IsOptional } from 'class-validator'
import { AdminRole } from '@shared/constants'

export class CreateAdminDto {
  @IsEmail()
  email: string

  @IsString()
  fullName: string

  @IsEnum(AdminRole)
  role: AdminRole
}

export class UpdateAdminDto {
  @IsOptional()
  @IsString()
  fullName?: string

  @IsOptional()
  @IsEnum(AdminRole)
  role?: AdminRole
}

export class UpdateAdminPasswordDto {
  @IsString()
  oldPassword: string

  @IsString()
  newPassword: string
}
