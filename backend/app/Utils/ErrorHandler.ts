import { ResponseContract } from '@ioc:Adonis/Core/Response'

export function handleError(error: any, response: ResponseContract) {
    const status = error.status || 500
    const message = error.message || 'Internal server error'
    const stack = process.env.NODE_ENV === 'development' ? error.stack : undefined

    return response.status(status).json({
        status: 'error',
        message,
        code: status,
        ...(stack && { stack }),
    })
}