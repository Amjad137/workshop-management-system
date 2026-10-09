import { IBaseEntity } from '@/constants/common.constants';
import { COLLECTIONS } from '@/constants/db.constants';
import { Model, Schema, model } from 'mongoose';

export enum WORKSHOP_STATUS {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface IWorkshop extends IBaseEntity {
  code: string;
  title: string;
  description?: string;
  category: string;
  location: string;
  instructor: string;
  date: Date;
  capacity: number;
  activeRegistrationsCount: number;
  status: WORKSHOP_STATUS;
  createdBy: string;
  updatedBy?: string;
}

export interface WorkshopModel extends Model<IWorkshop> {}

const WorkshopSchema = new Schema<IWorkshop, WorkshopModel>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    description: {
      type: String,
      trim: true
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    location: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    instructor: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    date: {
      type: Date,
      required: true,
      index: true
    },
    capacity: {
      type: Number,
      required: true,
      min: 1
    },
    activeRegistrationsCount: {
      type: Number,
      default: 0,
      min: 0,
      index: true
    },
    status: {
      type: String,
      enum: Object.values(WORKSHOP_STATUS),
      default: WORKSHOP_STATUS.SCHEDULED,
      index: true
    },
    createdBy: {
      type: String,
      required: true
    },
    updatedBy: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

WorkshopSchema.index({ date: 1, status: 1 });
WorkshopSchema.index({ activeRegistrationsCount: 1, capacity: 1 });

export const Workshop = model<IWorkshop, WorkshopModel>(COLLECTIONS.WORKSHOP, WorkshopSchema);
