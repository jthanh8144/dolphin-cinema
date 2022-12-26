import { Time } from '@entities'
import dataSource from '@shared/configs/data-source.config'
import { Repository } from 'typeorm'

export class TimeRepository extends Repository<Time> {
  constructor() {
    super(Time, dataSource.manager)
  }

  public getTimeById(id: number) {
    return this.findOne({ where: { id } })
  }
  public getAllShowtimes() {
    return this.find({
      select: ['id', 'time'],
    })
  }
}
