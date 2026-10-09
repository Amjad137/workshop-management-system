import { ENTITY_SORT } from '@/constants/db.constants';
import { BaseRepository } from './base.repository';
import { IWorkshop, Workshop, WorkshopModel } from '@/models/workshop.model';
import { FilterQuery, Types } from 'mongoose';

export interface WorkshopSearchCriteria {
  search_key?: string;
  from_date?: string;
  to_date?: string;
  status?: string;
  category?: string;
  location?: string;
  has_available_seats?: boolean;
}

class WorkshopRepository extends BaseRepository<IWorkshop, WorkshopModel> {
  constructor() {
    super(Workshop);
  }

  public findByCode = async (code: string) => {
    return this.model.findOne({ code: code.toUpperCase() });
  };

  public findByIdWithSeats = async (id: string | Types.ObjectId) => {
    return this.model.findById(id);
  };

  /**
   * Atomically books a seat using a conditional query with $expr.
   * Guarantees activeRegistrationsCount will NEVER exceed capacity, even with concurrent requests.
   */
  public atomicallyBookSeat = async (workshopId: string | Types.ObjectId) => {
    return this.model.findOneAndUpdate(
      {
        _id: workshopId,
        status: 'SCHEDULED',
        $expr: { $lt: ['$activeRegistrationsCount', '$capacity'] }
      },
      {
        $inc: { activeRegistrationsCount: 1 }
      },
      { new: true }
    );
  };

  /**
   * Atomically releases a seat when a registration is cancelled.
   */
  public atomicallyReleaseSeat = async (workshopId: string | Types.ObjectId) => {
    return this.model.findOneAndUpdate(
      {
        _id: workshopId,
        activeRegistrationsCount: { $gt: 0 }
      },
      {
        $inc: { activeRegistrationsCount: -1 }
      },
      { new: true }
    );
  };

  /**
   * Custom search with date range, seat availability, and text search
   */
  public searchWorkshops = async (
    criteria: WorkshopSearchCriteria,
    options: {
      limit?: number;
      skip?: number;
      sort_by?: string;
      sort_order?: ENTITY_SORT;
    }
  ) => {
    const filter: FilterQuery<IWorkshop> = {};

    if (criteria.search_key) {
      filter.$or = [
        { code: { $regex: criteria.search_key, $options: 'i' } },
        { title: { $regex: criteria.search_key, $options: 'i' } },
        { instructor: { $regex: criteria.search_key, $options: 'i' } },
        { location: { $regex: criteria.search_key, $options: 'i' } }
      ];
    }

    if (criteria.status) {
      filter.status = criteria.status;
    }

    if (criteria.category) {
      filter.category = { $regex: `^${criteria.category}$`, $options: 'i' };
    }

    if (criteria.location) {
      filter.location = { $regex: criteria.location, $options: 'i' };
    }

    if (criteria.from_date || criteria.to_date) {
      filter.date = {};
      if (criteria.from_date) {
        filter.date.$gte = new Date(criteria.from_date);
      }
      if (criteria.to_date) {
        filter.date.$lte = new Date(criteria.to_date);
      }
    }

    if (criteria.has_available_seats) {
      filter.$expr = { $lt: ['$activeRegistrationsCount', '$capacity'] };
    }

    return this.findAll(filter, options);
  };
}

export const workshopRepository = new WorkshopRepository();
