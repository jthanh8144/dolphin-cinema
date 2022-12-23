import { Comment } from '@entities'
import dataSource from '@shared/configs/data-source.config'
import { Repository } from 'typeorm'
import { movieDetail } from '@shared/constants'

export class CommentRepository extends Repository<Comment> {
  constructor() {
    super(Comment, dataSource.manager)
  }

  public getAllCommentByMovieId(movieId: number, page: number) {
    const limit = movieDetail.LIMIT_COMMENT_PAGE
    const skipQty: number = limit * page - limit
    return this.createQueryBuilder('comments')
      .leftJoinAndSelect('comments.user', 'user')
      .where('comments.movie_id = :id')
      .setParameters({
        id: movieId,
      })
      .orderBy('comments.createdAt', 'DESC')
      .take(limit)
      .skip(skipQty)
      .getMany()
  }
}
