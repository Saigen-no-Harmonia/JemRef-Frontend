import 'server-only'
import { z } from 'zod'
import { UserSchema } from './types'

const RegisterResponseSchema = z.object({ user: UserSchema })
export type RegisterResponse = z.output<typeof RegisterResponseSchema>

const LoginResponseSchema = z.object({ user: UserSchema })
export type LoginResponse = z.output<typeof LoginResponseSchema>

export async function registerAPI(): Promise<RegisterResponse> {
  // TODO: API疎通
  const stub = {
    user: {
      user_id: 'hogehoge12345'
    }
  }
  return RegisterResponseSchema.parse(stub)
}

export async function loginAPI(): Promise<LoginResponse> {
  // TODO: API疎通
  const stub = {
    user: {
      user_id: 'hogehoge12345'
    }
  }
  return LoginResponseSchema.parse(stub)
}

export async function withdrawAPI() {
  // TODO: API疎通
  return { ok: true }
}
