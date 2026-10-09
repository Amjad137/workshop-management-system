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
  sort_order?: 'asc' | 'desc';
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
