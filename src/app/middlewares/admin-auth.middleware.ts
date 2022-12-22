import { NextFunction, Request, Response } from 'express'
import firebase from 'firebase-admin'
import { IsNull } from 'typeorm'
import { AdminRepository } from '@repositories'
import { Admin } from '@entities'

const adminRepository: AdminRepository = new AdminRepository()

export const adminAuthMiddleware = {
  async isAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const { adminToken } = req.cookies
      if (!adminToken) {
        return res.redirect('/admin/login')
      }
      const response = await firebase.auth().verifyIdToken(adminToken)
      const { email } = response
      const admin = await adminRepository.findOne({
        where: { email, deletedAt: IsNull() },
      })
      if (!admin) {
        return res.redirect('/admin/login')
      }
      next()
    } catch (error) {
      next(error)
    }
  },
  async saveAdminLogged(req: Request, res: Response, next: NextFunction) {
    try {
      const { adminToken } = req.cookies
      let admin: Admin
      if (adminToken) {
        const response = await firebase.auth().verifyIdToken(adminToken)
        admin = await adminRepository.findOne({
          where: {
            email: response.email,
            deletedAt: IsNull(),
          },
        })
        res.locals.role = admin.role
      }
      res.locals.admin = admin
      next()
    } catch (error) {
      next(error)
    }
  },
}
