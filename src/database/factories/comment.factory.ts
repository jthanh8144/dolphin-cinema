import { define } from 'typeorm-seeding'
import { faker } from '@faker-js/faker'
import { Comment } from '../../app/entities'

define(Comment, () => {
  const comment = new Comment()
  comment.comment = faker.random.words(15)
  return comment
})
