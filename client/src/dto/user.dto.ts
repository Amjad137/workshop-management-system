import { USER_ROLE } from '@/constants/user.constants';
import { IBaseEntity } from '@/types/common.type';
import { IPaginationQuery } from './common.dto';

export interface IUser extends IBaseEntity {
  firstName: string;
  lastName: string;
  role: USER_ROLE;
  phoneNo: string;
  email: string;
  address: string;
  profilePicUrl?: string;
}

export interface IUserQuery extends IPaginationQuery {
  role?: USER_ROLE;
  isActive?: boolean;
}
