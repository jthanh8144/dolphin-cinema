import { User } from '@entities'
import dataSource from '@shared/configs/data-source.config'
import { Repository } from 'typeorm'

export class UserRepository extends Repository<User> {
  constructor() {
    super(User, dataSource.manager)
  }

  public async updateProfile(id: number, { fullName, birthday }) {
    await this.createQueryBuilder()
      .update(User)
      .set({
        fullName,
        birthday,
      })
      .where('id = :id')
      .setParameters({ id })
      .execute()
  }

  public async updateAvatar(id: number, avatarUrl: string) {
    await this.createQueryBuilder()
      .update(User)
      .set({ avatarUrl })
      .where('id = :id')
      .setParameters({ id })
      .execute()
  }

  public getAllUsers() {
    return this.find({
      order: {
        updatedAt: 'DESC',
      },
    })
  }

  public getUserById(id: number) {
    return this.findOne({ where: { id } })
  }

  public getUserByEmail(email: string) {
    return this.findOne({ where: { email } })
  }
}
