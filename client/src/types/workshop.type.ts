import { ENTITY_SORT } from "@/constants/common.constants";

export enum WORKSHOP_STATUS {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface IWorkshop {
  _id: string;
  code: string;
  title: string;
  description?: string;
  category: string;
  location: string;
  instructor: string;
  date: string;
  capacity: number;
  activeRegistrationsCount: number;
  status: WORKSHOP_STATUS;
  createdBy: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IWorkshopQuery {
  limit?: number;
  skip?: number;
  sort_by?: string;
  sort_order?: ENTITY_SORT;
  search_key?: string;
  from_date?: string;
  to_date?: string;
  status?: string;
  category?: string;
  location?: string;
  has_available_seats?: boolean;
}

export interface ICreateWorkshopPayload {
  code: string;
  title: string;
  description?: string;
  category: string;
  location: string;
  instructor: string;
  date: string;
  capacity: number;
}

export interface IUpdateWorkshopPayload {
  title?: string;
  description?: string;
  category?: string;
  location?: string;
  instructor?: string;
  date?: string;
  capacity?: number;
  status?: WORKSHOP_STATUS;
}
