import { IBaseEntity } from '@/constants/common.constants';
import { COLLECTIONS } from '@/constants/db.constants';
import { Model, Schema, Types, model } from 'mongoose';

export enum REGISTRATION_STATUS {
  REGISTERED = 'REGISTERED',
  CANCELLED = 'CANCELLED'
}

export interface IStaffActor {
  id: string;
  name: string;
  email: string;
}

export interface IRegistration extends IBaseEntity {
  workshopId: Types.ObjectId;
  attendeeName: string;
  attendeeEmail: string;
  status: REGISTRATION_STATUS;
  registeredBy: IStaffActor;
  registeredAt: Date;
  cancelledBy?: IStaffActor;
  cancelledAt?: Date;
  cancellationReason?: string;
  notes?: string;
}

export interface RegistrationModel extends Model<IRegistration> {}

const StaffActorSchema = new Schema<IStaffActor>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true }
  },
  { _id: false }
);

const RegistrationSchema = new Schema<IRegistration, RegistrationModel>(
  {
    workshopId: {
      type: Schema.Types.ObjectId,
      ref: COLLECTIONS.WORKSHOP,
      required: true,
      index: true
    },
    attendeeName: {
      type: String,
      required: true,
      trim: true
    },
    attendeeEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true
    },
    status: {
      type: String,
      enum: Object.values(REGISTRATION_STATUS),
      default: REGISTRATION_STATUS.REGISTERED,
      index: true
    },
    registeredBy: {
      type: StaffActorSchema,
      required: true
    },
    registeredAt: {
      type: Date,
      default: Date.now,
      index: true
    },
    cancelledBy: {
      type: StaffActorSchema
    },
    cancelledAt: {
      type: Date
    },
    cancellationReason: {
      type: String,
      trim: true
    },
    notes: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

RegistrationSchema.index(
  { workshopId: 1, attendeeEmail: 1 },
  {
    unique: true,
    partialFilterExpression: { status: REGISTRATION_STATUS.REGISTERED }
  }
);
RegistrationSchema.index({ workshopId: 1, status: 1 });
RegistrationSchema.index({ registeredAt: -1 });

export const Registration = model<IRegistration, RegistrationModel>(
  COLLECTIONS.REGISTRATION,
  RegistrationSchema
);
