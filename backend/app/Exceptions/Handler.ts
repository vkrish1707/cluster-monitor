import Logger from '@ioc:Adonis/Core/Logger'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Exception } from '@adonisjs/core/build/standalone'

export default class ExceptionHandler extends Exception {
  public async handle(error: this, ctx: HttpContextContract) {
    const { response } = ctx

    if (error.code === 'E_VALIDATION_FAILURE') {
      return response.badRequest({ message: 'Validation error', errors: error.message })
    }

    if (error.message === 'Cluster not found') {
      return response.notFound({ message: error.message })
    }

    Logger.error(error.message)

    return response.status(500).send({
      message: 'Internal Server Error',
      ...(process.env.NODE_ENV !== 'production' && { debug: error.message }),
    })
  }
}