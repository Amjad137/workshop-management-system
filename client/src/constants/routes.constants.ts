export const ROUTES = {
  MARKETING_ROOT: '/',
  SAAS_ROOT: '/portal',

  SIGN_UP: '/auth/sign-up',
  SIGN_IN: '/auth/sign-in',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',

  USERS_ROOT: '/portal/users', // Access: Admin
  WORKSHOPS_ROOT: '/portal/workshops', // Access: Manager, Staff
  REGISTRATIONS_ROOT: '/portal/registrations', // Access: Manager, Staff
  AUDIT_LOGS_ROOT: '/portal/audit-logs', // Access: Admin, Manager
};

export const ADMIN_ROUTES = {
  ROOT: ROUTES.SAAS_ROOT,
  USERS_ROOT: ROUTES.USERS_ROOT,
  AUDIT_LOGS_ROOT: ROUTES.AUDIT_LOGS_ROOT,
};

export const MANAGER_ROUTES = {
  ROOT: ROUTES.SAAS_ROOT,
  WORKSHOPS_ROOT: ROUTES.WORKSHOPS_ROOT,
  REGISTRATIONS_ROOT: ROUTES.REGISTRATIONS_ROOT,
  AUDIT_LOGS_ROOT: ROUTES.AUDIT_LOGS_ROOT,
};

export const STAFF_ROUTES = {
  ROOT: ROUTES.SAAS_ROOT,
  WORKSHOPS_ROOT: ROUTES.WORKSHOPS_ROOT,
  REGISTRATIONS_ROOT: ROUTES.REGISTRATIONS_ROOT,
};
