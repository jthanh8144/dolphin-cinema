import { environment } from '../constants'

export default {
  database: environment.database.database,
  type: 'postgres',
  username: environment.database.username,
  password: environment.database.password,
  port: +(environment.database.port || 0),
  host: environment.database.host,
  entities: ['src/app/entities/*.entity{.ts,.js}'],
  seeds: ['src/database/seeds/*{.ts,.js}'],
  factories: ['src/database/factories/*.factory{.ts,.js}'],
  synchronize: false,
  logging: false,
}
