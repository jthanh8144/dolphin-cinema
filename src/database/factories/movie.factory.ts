import { define } from 'typeorm-seeding'
import { faker } from '@faker-js/faker'
import { Movie } from '../../app/entities'

define(Movie, () => {
  const movie = new Movie()
  movie.name = faker.random.words(6)
  movie.description = faker.lorem.paragraph()
  movie.image = 'https://picsum.photos/200/300'
  movie.trailerUrl = faker.helpers.arrayElement([
    'https://www.youtube.com/watch?v=INH-WOXnElg',
    'https://www.youtube.com/watch?v=kOh1OTokLCk',
    'https://www.youtube.com/watch?v=2yzesFMQ7u4',
    'https://www.youtube.com/watch?v=wI8cpTd0-r8',
  ])
  movie.reviewScore = faker.datatype.float({ min: 1, max: 5, precision: 0.1 })
  movie.releaseDate = faker.date.recent()
  movie.showtimeDuration = faker.helpers.arrayElement([60, 90, 120, 150])
  movie.writer = faker.name.firstName() + ' ' + faker.name.lastName()
  movie.director = faker.name.firstName() + ' ' + faker.name.lastName()
  movie.language = faker.helpers.arrayElement([
    'English',
    'Korea',
    'Viet Nam',
    'Thailand',
    'China',
  ])
  return movie
})
