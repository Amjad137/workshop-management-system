import { ENTITY_SORT } from '@/constants/common.constants';

export enum REGISTRATION_STATUS {
  REGISTERED = 'REGISTERED',
  CANCELLED = 'CANCELLED',
}

export interface IStaffActor {
  id: string;
  name: string;
  email: string;
}

export interface IRegistration {
  _id: string;
  workshopId: string | { _id: string; code: string; title: string; location: string };
  attendeeName: string;
  attendeeEmail: string;
  status: REGISTRATION_STATUS;
  registeredBy: IStaffActor;
  registeredAt: string;
  cancelledBy?: IStaffActor;
  cancelledAt?: string;
  cancellationReason?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IRegistrationQuery {
  limit?: number;
  skip?: number;
  sort_by?: string;
  sort_order?: ENTITY_SORT;
  workshopId?: string;
  status?: string;
  attendeeEmail?: string;
  search_key?: string;
}

export interface IRegisterAttendeePayload {
  workshopId: string;
  attendeeName: string;
  attendeeEmail: string;
  notes?: string;
}

export interface ICancelRegistrationPayload {
  cancellationReason?: string;
}

export enum WAITLIST_STATUS {
  WAITING = 'WAITING',
  OFFERED = 'OFFERED',
  PROMOTED = 'PROMOTED',
  CANCELLED = 'CANCELLED',
}

export interface IWaitlistWorkshopInfo {
  _id: string;
  code: string;
  title: string;
  location: string;
  date: string;
  capacity: number;
  activeRegistrationsCount: number;
  status: string;
}

export interface IWaitlist {
  _id: string;
  workshopId: string | IWaitlistWorkshopInfo;
  attendeeName: string;
  attendeeEmail: string;
  status: WAITLIST_STATUS;
  registeredBy: IStaffActor;
  registeredAt: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IWaitlistQuery {
  workshopId?: string;
  search_key?: string;
  limit?: number;
  skip?: number;
}
