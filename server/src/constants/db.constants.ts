export enum COLLECTIONS {
  USER = 'user',
  ACCOUNT = 'account',
  SESSION = 'session',
  ORGANIZATION = 'organization',
  MEMBER = 'member',
  INVITATION = 'invitation',
  PASSWORD_RESET_REQUESTS = 'password_reset_requests',
  AUDIT_LOGS = 'audit_logs',
  WORKSHOP = 'workshops',
  REGISTRATION = 'registrations',
  WAITLIST = 'waitlists',
  USER_INVITATIONS = 'user_invitations'
}

export enum ENTITY_STATUS {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  HIDDEN = 'HIDDEN',
  DELETED = 'DELETED',
  AVAILABLE = 'AVAILABLE'
}

export enum ENTITY_SORT {
  ASC = 'asc',
  DESC = 'desc'
}

export enum USER_ENTITY_STATUS {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  CLOSED = 'CLOSED',
  DELETED = 'DELETED'
}
