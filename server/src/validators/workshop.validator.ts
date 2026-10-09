import { yupValidator } from '@/middleware/yup-validator.middleware';
import { WORKSHOP_STATUS } from '@/models/workshop.model';
import { object, string, number, boolean, InferType } from 'yup';

export const createWorkshopSchema = object({
  code: string().required('Workshop code is required').trim(),
  title: string().required('Title is required').trim(),
  description: string().trim().optional(),
  category: string().required('Category is required').trim(),
  location: string().required('Location is required').trim(),
  instructor: string().required('Instructor is required').trim(),
  date: string().required('Date is required'),
  capacity: number().required('Capacity is required').positive('Capacity must be greater than 0').integer()
});

export const updateWorkshopSchema = object({
  title: string().trim().optional(),
  description: string().trim().optional(),
  category: string().trim().optional(),
  location: string().trim().optional(),
  instructor: string().trim().optional(),
  date: string().optional(),
  capacity: number().positive().integer().optional(),
  status: string().oneOf(Object.values(WORKSHOP_STATUS)).optional()
});

export const workshopQuerySchema = object({
  limit: number().integer().min(1).max(100).default(20),
  skip: number().integer().min(0).default(0),
  sort_by: string().default('date'),
  sort_order: string().oneOf(['asc', 'desc']).default('asc'),
  search_key: string().optional(),
  from_date: string().optional(),
  to_date: string().optional(),
  status: string().oneOf(Object.values(WORKSHOP_STATUS)).optional(),
  category: string().optional(),
  location: string().optional(),
  has_available_seats: boolean().optional()
});

export const createWorkshopValidator = yupValidator('json', createWorkshopSchema);
export const updateWorkshopValidator = yupValidator('json', updateWorkshopSchema);
export const workshopQueryValidator = yupValidator('query', workshopQuerySchema);

export type ICreateWorkshopInput = InferType<typeof createWorkshopSchema>;
export type IUpdateWorkshopInput = InferType<typeof updateWorkshopSchema>;
export type IWorkshopQueryInput = InferType<typeof workshopQuerySchema>;
