import { yupValidator } from '@/middleware/yup-validator.middleware';
import { REGISTRATION_STATUS } from '@/models/registration.model';
import { object, string, number, InferType } from 'yup';

export const registerAttendeeSchema = object({
  workshopId: string().required('Workshop ID is required'),
  attendeeName: string().required('Attendee name is required').trim(),
  attendeeEmail: string().email('Invalid email address').required('Attendee email is required').trim(),
  notes: string().trim().optional()
});

export const cancelRegistrationSchema = object({
  cancellationReason: string().trim().optional()
});

export const registrationQuerySchema = object({
  limit: number().integer().min(1).max(100).default(20),
  skip: number().integer().min(0).default(0),
  sort_by: string().default('registeredAt'),
  sort_order: string().oneOf(['asc', 'desc']).default('desc'),
  workshopId: string().optional(),
  status: string().oneOf(Object.values(REGISTRATION_STATUS)).optional(),
  attendeeEmail: string().optional(),
  search_key: string().optional()
});

export const registerAttendeeValidator = yupValidator('json', registerAttendeeSchema);
export const cancelRegistrationValidator = yupValidator('json', cancelRegistrationSchema);
export const registrationQueryValidator = yupValidator('query', registrationQuerySchema);

export type IRegisterAttendeeInput = InferType<typeof registerAttendeeSchema>;
export type ICancelRegistrationInput = InferType<typeof cancelRegistrationSchema>;
export type IRegistrationQueryInput = InferType<typeof registrationQuerySchema>;
