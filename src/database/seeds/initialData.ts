import 'dotenv/config'
import {
  MovieRepository,
  LocationRepository,
  CinemaRepository,
  CinemaRoomRepository,
  SeatTypeRepository,
  SeatRepository,
  CinemaSeatRepository,
  TimeRepository,
  ShowtimeRepository,
} from '../../app/repositories'
import { SeatTypeEnum, SeatRow } from '../../shared/constants'
import { databaseProvider } from '../../shared/providers/database.provider'
;(async () => {
  await databaseProvider.initialize()
  const movieRepository = new MovieRepository()
  const locationRepository = new LocationRepository()
  const cinemaRepository = new CinemaRepository()
  const cinemaRoomRepository = new CinemaRoomRepository()
  const seatTypeRepository = new SeatTypeRepository()
  const seatRepository = new SeatRepository()
  const cinemaSeatRepository = new CinemaSeatRepository()
  const timeRepository = new TimeRepository()
  const showtimeRepository = new ShowtimeRepository()

  const movies = await movieRepository.save(
    movieRepository.create([
      {
        name: 'Detective Conan Movie 26: Kurogane no Submarine',
        trailerUrl: 'https://www.youtube.com/watch?v=0jIpAPLbpt0',
        showtimeDuration: 110,
        description: 'Detective Conan Movie 26: Kurogane no Submarine',
        image:
          'https://minio.jthanh8144.click/dolphin-cinema/1674975613530_conan-26.jpg',
        reviewScore: 0,
        releaseDate: new Date(),
      },
      {
        name: 'Detective Conan Movie 25: The Bride Of Halloween',
        trailerUrl: 'https://www.youtube.com/watch?v=SqSJPzWvcLc',
        showtimeDuration: 110,
        description: 'Detective Conan Movie 25: The Bride Of Halloween',
        image:
          'https://minio.jthanh8144.click/dolphin-cinema/1674975367395_conan-25.jpg',
        reviewScore: 0,
        releaseDate: new Date(),
      },
      {
        name: 'On your wedding day',
        trailerUrl: 'https://www.youtube.com/watch?v=z594SzQ7xbg',
        showtimeDuration: 120,
        description: '',
        image:
          'https://minio.jthanh8144.click/dolphin-cinema/1674975406498_on_your_wedding_day.jpg',
        reviewScore: 0,
        releaseDate: new Date(),
      },
      {
        name: 'Be with you',
        trailerUrl: 'https://www.youtube.com/watch?v=OcpJ08cxmnk',
        showtimeDuration: 120,
        description: '',
        image:
          'https://minio.jthanh8144.click/dolphin-cinema/1674975495132_be_with_you.jpg',
        reviewScore: 0,
        releaseDate: new Date(),
      },
      {
        name: 'The Medium',
        trailerUrl: 'https://www.youtube.com/watch?v=abIU3yyoLSY',
        showtimeDuration: 120,
        description: '',
        image:
          'https://minio.jthanh8144.click/dolphin-cinema/1674975535442_the_medium.jpg',
        reviewScore: 0,
        releaseDate: new Date(),
      },
      {
        name: 'INCANTATION',
        trailerUrl: 'https://www.youtube.com/watch?v=HnyNZdcL_GY',
        showtimeDuration: 120,
        description: '',
        image:
          'https://minio.jthanh8144.click/dolphin-cinema/1674975556213_incantation.jpg',
        reviewScore: 0,
        releaseDate: new Date(),
      },
      {
        name: 'Mat biec',
        trailerUrl: 'https://www.youtube.com/watch?v=ITlQ0oU7tDA',
        showtimeDuration: 120,
        description: '',
        image:
          'https://minio.jthanh8144.click/dolphin-cinema/1674975586842_mat_biec.jpg',
        reviewScore: 0,
        releaseDate: new Date(),
      },
    ]),
  )

  const locations = await locationRepository.save(
    locationRepository.create([
      { name: 'Da Nang' },
      { name: 'Quang Nam' },
      { name: 'Hue' },
    ]),
  )

  const cinemas = await cinemaRepository.save(
    cinemaRepository.create([
      { location: locations[0], name: '101 Dien Bien Phu', basePrice: 60000 },
      { location: locations[0], name: '10 2 Thang 9', basePrice: 45000 },
      { location: locations[0], name: '86 Vo Nguyen Giap', basePrice: 45000 },
      { location: locations[1], name: 'Hoi An', basePrice: 45000 },
      { location: locations[1], name: 'Dien Ban', basePrice: 40000 },
      { location: locations[2], name: 'Hue', basePrice: 40000 },
    ]),
  )

  const cinemaRooms = await cinemaRoomRepository.save(
    cinemaRoomRepository.create([
      { cinema: cinemas[0], name: 'A1' },
      { cinema: cinemas[0], name: 'A2' },
      { cinema: cinemas[1], name: 'A1' },
      { cinema: cinemas[2], name: 'A2' },
      { cinema: cinemas[3], name: 'A2' },
      { cinema: cinemas[4], name: 'B1' },
      { cinema: cinemas[5], name: 'B1' },
    ]),
  )

  const seatTypes = await seatTypeRepository.save(
    seatTypeRepository.create([
      { name: 'Vip 1', type: SeatTypeEnum.vip1, surcharge: 10000 },
      { name: 'Vip 2', type: SeatTypeEnum.vip2, surcharge: 5000 },
      { name: 'Normal', type: SeatTypeEnum.vip6 },
    ]),
  )

  const seatRowKeys = Object.keys(SeatRow) as (keyof typeof SeatRow)[]
  const result = []
  for (const key of seatRowKeys) {
    for (let i = 1; i <= 20; i++) {
      result.push(seatRepository.create({ column: i, row: SeatRow[key] }))
    }
  }
  const seats = await seatRepository.save(seatRepository.create(result))
  for (const seat of seats) {
    await Promise.all(
      cinemaRooms.map(async (_, index) => {
        return await cinemaSeatRepository.save(
          cinemaSeatRepository.create({
            cinemaRoom: cinemaRooms[index],
            seat,
            seatType: seatTypes[Math.floor(Math.random() * seatTypes.length)],
          }),
        )
      }),
    )
  }

  const times = await timeRepository.save(
    timeRepository.create([
      { time: '[2022-01-01 8:00, 2022-01-01 9:30)', remark: 'Time 0' },
      { time: '[2022-01-01 10:00, 2022-01-01 11:30)', remark: 'Time 1' },
      { time: '[2022-01-01 13:30, 2022-01-01 15:00)', remark: 'Time 2' },
      { time: '[2022-01-01 16:00, 2022-01-01 17:30)', remark: 'Time 3' },
      { time: '[2022-01-01 18:00, 2022-01-01 19:30)', remark: 'Time 4' },
      { time: '[2022-01-01 20:00, 2022-01-01 21:30)', remark: 'Time 5' },
      { time: '[2022-01-01 22:00, 2022-01-01 23:30)', remark: 'Time 6' },
    ]),
  )

  await showtimeRepository.save(
    showtimeRepository.create([
      {
        cinemaRoom: cinemaRooms[0],
        time: times[0],
        movie: movies[0],
        showDate: new Date().toISOString(),
      },
      {
        cinemaRoom: cinemaRooms[1],
        time: times[3],
        movie: movies[0],
        showDate: new Date().toISOString(),
      },
      {
        cinemaRoom: cinemaRooms[0],
        time: times[4],
        movie: movies[1],
        showDate: new Date().toISOString(),
      },
      {
        cinemaRoom: cinemaRooms[5],
        time: times[5],
        movie: movies[1],
        showDate: new Date().toISOString(),
      },
      {
        cinemaRoom: cinemaRooms[2],
        time: times[6],
        movie: movies[1],
        showDate: new Date().toISOString(),
      },
    ]),
  )
})()
