import { auth } from '@/config/better-auth';
import { USER_ENTITY_STATUS } from '@/constants/db.constants';
import type { Organization, Member, Invitation } from 'better-auth/plugins';

// Core session types
export type ISession = (typeof auth)['$Infer']['Session']['session'];
export type IUser = (typeof auth)['$Infer']['Session']['user'] & {
  phoneNumber?: string;
  role?: string;
  banned?: boolean | null;
  status?: USER_ENTITY_STATUS;
};
export type IOrganization = Organization;
export type IMember = Member;
export type IInvitation = Invitation;
