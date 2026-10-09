import { ENTITY_SORT } from '@/constants/db.constants';
import { BaseRepository } from './base.repository';
import {
  IRegistration,
  IStaffActor,
  REGISTRATION_STATUS,
  Registration,
  RegistrationModel
} from '@/models/registration.model';
import { FilterQuery, Types } from 'mongoose';

export interface RegistrationSearchCriteria {
  workshopId?: string;
  status?: string;
  attendeeEmail?: string;
  search_key?: string;
}

class RegistrationRepository extends BaseRepository<IRegistration, RegistrationModel> {
  constructor() {
    super(Registration);
  }

  public findActiveByWorkshopAndEmail = async (workshopId: string | Types.ObjectId, email: string) => {
    return this.model.findOne({
      workshopId,
      attendeeEmail: email.toLowerCase().trim(),
      status: REGISTRATION_STATUS.REGISTERED
    });
  };

  public findByIdWithWorkshop = async (id: string | Types.ObjectId) => {
    return this.model.findById(id).populate('workshopId');
  };

  /**
   * Atomically mark registration as cancelled and record audit details.
   */
  public cancelRegistration = async (
    id: string | Types.ObjectId,
    cancelledBy: IStaffActor,
    reason?: string
  ) => {
    return this.model.findOneAndUpdate(
      {
        _id: id,
        status: REGISTRATION_STATUS.REGISTERED
      },
      {
        $set: {
          status: REGISTRATION_STATUS.CANCELLED,
          cancelledBy,
          cancelledAt: new Date(),
          ...(reason ? { cancellationReason: reason } : {})
        }
      },
      { new: true }
    );
  };

  /**
   * Search registrations across workshops or for a specific workshop
   */
  public searchRegistrations = async (
    criteria: RegistrationSearchCriteria,
    options: {
      limit?: number;
      skip?: number;
      sort_by?: string;
      sort_order?: ENTITY_SORT;
    }
  ) => {
    const filter: FilterQuery<IRegistration> = {};

    if (criteria.workshopId) {
      filter.workshopId = new Types.ObjectId(criteria.workshopId);
    }

    if (criteria.status) {
      filter.status = criteria.status;
    }

    if (criteria.attendeeEmail) {
      filter.attendeeEmail = criteria.attendeeEmail.toLowerCase().trim();
    }

    if (criteria.search_key) {
      filter.$or = [
        { attendeeName: { $regex: criteria.search_key, $options: 'i' } },
        { attendeeEmail: { $regex: criteria.search_key, $options: 'i' } },
        { 'registeredBy.name': { $regex: criteria.search_key, $options: 'i' } }
      ];
    }

    return this.findAll(filter, options);
  };
}

export const registrationRepository = new RegistrationRepository();
