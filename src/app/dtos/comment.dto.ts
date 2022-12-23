import { IsString, IsNumber } from 'class-validator'

export class CreateCommentDto {
  @IsNumber()
  movie_id: number

  @IsString()
  comment: string
}
export class UpdateCommentDto {
  @IsString()
  comment: string
}
