import { yupValidator } from '@/middleware/yup-validator.middleware';
import { InferType } from 'yup';
import { userEditSchema } from './schema/user/user-edit.schema';
import { userCountQuerySchema, userQuerySchema } from './schema/user/user-query.schema';

import { object, string } from 'yup';
import { SYSTEM_ROLE } from '@/constants/user.constants';

export const createUserSchema = object({
  name: string().required('Name is required').trim(),
  email: string().email('Invalid email').required('Email is required').trim().lowercase(),
  password: string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  phoneNumber: string().optional(),
  role: string().oneOf(Object.values(SYSTEM_ROLE)).default(SYSTEM_ROLE.STAFF)
});

export const userQueryValidator = yupValidator('query', userQuerySchema);
export const userEditValidator = yupValidator('json', userEditSchema);
export const userCountQueryValidator = yupValidator('query', userCountQuerySchema);
export const createUserValidator = yupValidator('json', createUserSchema);

export type IUserQuery = InferType<typeof userQuerySchema>;
export type IUserEdit = InferType<typeof userEditSchema>;
export type IUserCountQuery = InferType<typeof userCountQuerySchema>;
export type ICreateUserInput = InferType<typeof createUserSchema>;

