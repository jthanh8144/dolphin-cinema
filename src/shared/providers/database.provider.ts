import dataSource from '@shared/configs/data-source.config'

class DatabaseProvider {
  public async initialize() {
    await dataSource.initialize()
  }
}

export const databaseProvider = new DatabaseProvider()
