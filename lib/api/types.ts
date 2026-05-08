import { z } from 'zod'

export const UserSchema = z
  .object({
    user_id: z.string(),
  })
  .transform((raw) => ({
    userID: raw.user_id,
  }))

export type User = z.output<typeof UserSchema>
