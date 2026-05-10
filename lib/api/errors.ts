export const SESSION_EXPIRED = 'SESSION_EXPIRED' as const

export class SessionExpiredError extends Error {
  constructor() {
    super(SESSION_EXPIRED)
  }
}
