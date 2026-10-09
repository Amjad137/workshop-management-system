import { USER_ROLE } from '@/constants/user.constants';

export interface IUserInvitation {
  _id: string;
  invitationCode: string;
  email: string;
  role: USER_ROLE;
  isUsed: boolean;
  usedAt?: string;
  usedBy?: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateInvitationPayload {
  email: string;
  role: string;
}

export interface IValidatedInvitation {
  invitationCode: string;
  email: string;
  role: USER_ROLE;
  expiresAt: string;
}

export interface IInvitationQuery {
  limit?: number;
  skip?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  search_key?: string;
  role?: string;
  isUsed?: boolean;
}
