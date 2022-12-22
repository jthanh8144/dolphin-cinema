import { Time } from '@entities'
import dataSource from '@shared/configs/data-source.config'
import { Repository } from 'typeorm'

export class TimeRepository extends Repository<Time> {
  constructor() {
    super(Time, dataSource.manager)
  }
}
