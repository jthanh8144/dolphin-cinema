import { envSchema } from '@shared/configs/environment.config'
import createHttpError from 'http-errors'
import Joi from 'joi'
import { logger } from './logger.provider'

class EnvLoadProvider {
  public validate() {
    const envVarsSchema = Joi.object(envSchema)

    const { error } = envVarsSchema.validate(process.env, {
      allowUnknown: true,
    })

    if (error) {
      throw new createHttpError.InternalServerError(
        `Config validation error: ${error.message}`,
      )
    }
    logger.log(`Env load done!`)
  }
}

export const envLoadProvider = new EnvLoadProvider()
