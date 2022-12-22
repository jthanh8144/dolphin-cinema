import { CinemaRoom } from '@entities'
import dataSource from '@shared/configs/data-source.config'
import { Repository } from 'typeorm'

export class CinemaRoomRepository extends Repository<CinemaRoom> {
  constructor() {
    super(CinemaRoom, dataSource.manager)
  }

  public getAllCinemaRooms() {
    return this.find()
  }

  public getRoomsByCinemaId(id: number) {
    return this.find({
      relations: ['cinema'],
      where: { cinema: { id } },
      order: { name: 'ASC' },
    })
  }

  public getRoomById(id: number) {
    return this.findOne({
      relations: ['cinema'],
      where: { id },
    })
  }
}
