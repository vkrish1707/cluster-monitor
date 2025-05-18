import { schema } from '@ioc:Adonis/Core/Validator'

export default class UpdatePolicyValidator {
  public schema = schema.create({
    frequency: schema.enum(['daily', 'weekly', 'hourly'] as const),
    time: schema.string(),
    locking: schema.boolean(),
  })
}