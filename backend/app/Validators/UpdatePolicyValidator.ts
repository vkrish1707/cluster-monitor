import { schema } from '@ioc:Adonis/Core/Validator'

export default class UpdatePolicyValidator {
  public schema = schema.create({
    frequency: schema.enum(['daily', 'weekly'] as const),
    time: schema.string(),
    timezone: schema.string(),
    deleteAfterDays: schema.number.optional(),
    enabled: schema.boolean(),
    locking: schema.boolean(),
    days: schema.array.optional().members(
      schema.enum([
        'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'
      ] as const)
    ),
  })
}