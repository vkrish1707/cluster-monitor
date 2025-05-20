import { schema } from '@ioc:Adonis/Core/Validator'

export default class UpdatePolicyValidator {
  public schema = schema.create({
    id: schema.string(),
    snapshotPolicy: schema.object().members({
      policyName: schema.string(),
      applyToDirectory: schema.string(),
      frequency: schema.enum(['daily', 'weekly'] as const),
      time: schema.string(),
      deleteAfterDays: schema.number.optional(),
      enabled: schema.boolean(),
      locking: schema.boolean(),
      days: schema.array.optional().members(
        schema.enum([
          'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Every day'
        ] as const)
      ),
    }),
  })
}