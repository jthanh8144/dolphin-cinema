import { SeatType } from '@entities'
import dataSource from '@shared/configs/data-source.config'
import { Repository } from 'typeorm'

export class SeatTypeRepository extends Repository<SeatType> {
  constructor() {
    super(SeatType, dataSource.manager)
  }

  public getAllSeatTypes() {
    return this.find({ order: { name: 'ASC' } })
  }

  public getSeatTypeById(id: number) {
    return this.findOne({ where: { id } })
  }
}
