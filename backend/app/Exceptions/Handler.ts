import Logger from '@ioc:Adonis/Core/Logger'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Exception } from '@adonisjs/core/build/standalone'

export default class ExceptionHandler extends Exception {
  public async handle(error: this, ctx: HttpContextContract) {
    const { response } = ctx

    // Handle AdonisJS validation errors in detail
    if (error.code === 'E_VALIDATION_FAILURE' && error.message) {
      return response.unprocessableEntity({
        message: 'Validation error',
        errors: error.message, // this is an array of detailed error objects
      })
    }

    // Handle not found errors
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