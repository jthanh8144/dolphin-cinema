import { Location } from '@entities'
import dataSource from '@shared/configs/data-source.config'
import { Repository } from 'typeorm'

export class LocationRepository extends Repository<Location> {
  constructor() {
    super(Location, dataSource.manager)
  }

  public getAllLocations() {
    return this.find()
  }

  public getLocationById(id: number) {
    return this.findOne({ where: { id } })
  }
}
