import { yupValidator } from '@/middleware/yup-validator.middleware';
import { SYSTEM_ROLE } from '@/constants/user.constants';
import { object, string, number, boolean, InferType } from 'yup';

export const createInvitationSchema = object({
  email: string().email('Invalid email address').required('Email is required').trim().lowercase(),
  role: string()
    .oneOf([SYSTEM_ROLE.ADMIN, SYSTEM_ROLE.MANAGER, SYSTEM_ROLE.STAFF], 'Invalid role')
    .required('Role is required')
});

export const invitationQuerySchema = object({
  search_key: string().trim().optional(),
  role: string().oneOf([SYSTEM_ROLE.ADMIN, SYSTEM_ROLE.MANAGER, SYSTEM_ROLE.STAFF]).optional(),
  isUsed: boolean().optional(),
  limit: number().integer().min(1).max(100).default(20),
  skip: number().integer().min(0).default(0),
  sort_by: string().default('createdAt'),
  sort_order: string().oneOf(['asc', 'desc']).default('desc')
});

export const createInvitationValidator = yupValidator('json', createInvitationSchema);
export const invitationQueryValidator = yupValidator('query', invitationQuerySchema);

export type ICreateInvitationInput = InferType<typeof createInvitationSchema>;
export type IInvitationQuery = InferType<typeof invitationQuerySchema>;
