import { IBaseEntity } from '@/constants/common.constants';
import { COLLECTIONS, ENTITY_STATUS } from '@/constants/db.constants';
import { SYSTEM_ROLE } from '@/constants/user.constants';
import { Model, Schema, Types, model } from 'mongoose';

export interface IUserInvitation extends IBaseEntity {
  invitationCode: string;
  email: string;
  role: SYSTEM_ROLE;
  isUsed: boolean;
  entityStatus?: ENTITY_STATUS;
  usedAt?: Date;
  usedBy?: string;
  expiresAt: Date;
  createdById?: Types.ObjectId;
}

export interface UserInvitationModel extends Model<IUserInvitation> {}

const UserInvitationSchema = new Schema<IUserInvitation, UserInvitationModel>(
  {
    invitationCode: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true
    },
    role: {
      type: String,
      required: true,
      enum: Object.values(SYSTEM_ROLE),
      index: true
    },
    isUsed: {
      type: Boolean,
      required: true,
      default: false,
      index: true
    },
    entityStatus: {
      type: String,
      required: true,
      enum: Object.values(ENTITY_STATUS),
      default: ENTITY_STATUS.ACTIVE,
      index: true
    },
    usedAt: {
      type: Date
    },
    usedBy: {
      type: String
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true
    },
    createdById: {
      type: Schema.Types.ObjectId,
      index: true
    }
  },
  { timestamps: true }
);

UserInvitationSchema.index({ email: 1, isUsed: 1 });

export const UserInvitation = model<IUserInvitation, UserInvitationModel>(
  COLLECTIONS.USER_INVITATIONS,
  UserInvitationSchema
);
