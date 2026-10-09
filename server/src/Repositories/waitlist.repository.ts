import { BaseRepository } from './base.repository';
import { IWaitlist, WAITLIST_STATUS, Waitlist, WaitlistModel } from '@/models/waitlist.model';
import { Types } from 'mongoose';

class WaitlistRepository extends BaseRepository<IWaitlist, WaitlistModel> {
  constructor() {
    super(Waitlist);
  }

  public findActiveByWorkshop = async (workshopId: string | Types.ObjectId) => {
    return this.model
      .find({
        workshopId,
        status: WAITLIST_STATUS.WAITING
      })
      .sort({ createdAt: 1 });
  };

  public getNextInLine = async (workshopId: string | Types.ObjectId) => {
    return this.model.findOne({
      workshopId,
      status: WAITLIST_STATUS.WAITING
    }).sort({ createdAt: 1 });
  };

  public findActiveByWorkshopAndEmail = async (
    workshopId: string | Types.ObjectId,
    email: string
  ) => {
    return this.model.findOne({
      workshopId,
      attendeeEmail: email.toLowerCase().trim(),
      status: WAITLIST_STATUS.WAITING
    });
  };

  public markPromoted = async (
    workshopId: string | Types.ObjectId,
    email: string
  ) => {
    return this.model.updateMany(
      {
        workshopId,
        attendeeEmail: email.toLowerCase().trim(),
        status: WAITLIST_STATUS.WAITING
      },
      {
        $set: { status: WAITLIST_STATUS.PROMOTED }
      }
    );
  };
}

export const waitlistRepository = new WaitlistRepository();
