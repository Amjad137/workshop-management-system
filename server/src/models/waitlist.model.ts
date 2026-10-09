import { IBaseEntity } from '@/constants/common.constants';
import { COLLECTIONS } from '@/constants/db.constants';
import { Model, Schema, Types, model } from 'mongoose';
import { IStaffActor } from './registration.model';

export enum WAITLIST_STATUS {
  WAITING = 'WAITING',
  OFFERED = 'OFFERED',
  PROMOTED = 'PROMOTED',
  CANCELLED = 'CANCELLED'
}

export interface IWaitlist extends IBaseEntity {
  workshopId: Types.ObjectId;
  attendeeName: string;
  attendeeEmail: string;
  status: WAITLIST_STATUS;
  registeredBy: IStaffActor;
  registeredAt: Date;
  notes?: string;
}

export interface WaitlistModel extends Model<IWaitlist> {}

const StaffActorSchema = new Schema<IStaffActor>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true }
  },
  { _id: false }
);

const WaitlistSchema = new Schema<IWaitlist, WaitlistModel>(
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
      enum: Object.values(WAITLIST_STATUS),
      default: WAITLIST_STATUS.WAITING,
      index: true
    },
    registeredBy: {
      type: StaffActorSchema,
      required: true
    },
    registeredAt: {
      type: Date,
      default: Date.now
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

WaitlistSchema.index({ workshopId: 1, status: 1, createdAt: 1 });
WaitlistSchema.index(
  { workshopId: 1, attendeeEmail: 1 },
  {
    unique: true,
    partialFilterExpression: { status: WAITLIST_STATUS.WAITING }
  }
);

export const Waitlist = model<IWaitlist, WaitlistModel>(COLLECTIONS.WAITLIST, WaitlistSchema);

