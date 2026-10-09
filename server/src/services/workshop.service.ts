import { ENTITY_SORT } from '@/constants/db.constants';
import { ERROR_MESSAGES } from '@/constants/error.constants';
import BadRequestException from '@/exceptions/bad-request.exception';
import ConflictException from '@/exceptions/conflict.exception';
import NotFoundException from '@/exceptions/not-found.exception';
import { IWorkshop, WORKSHOP_STATUS } from '@/models/workshop.model';
import { workshopRepository, WorkshopSearchCriteria } from '@/Repositories/workshop.repository';
import { AuditLog } from '@/models/audit-log.model';
import { AUDIT_ACTION, AUDIT_ENTITY_TYPE, AUDIT_STATUS } from '@/constants/audit-log.constants';
import { IUser } from '@/models/auth.models';
import { Types } from 'mongoose';

export interface ICreateWorkshopDTO {
  code: string;
  title: string;
  description?: string;
  category: string;
  location: string;
  instructor: string;
  date: string | Date;
  capacity: number;
}

export interface IUpdateWorkshopDTO {
  title?: string;
  description?: string;
  category?: string;
  location?: string;
  instructor?: string;
  date?: string | Date;
  capacity?: number;
  status?: WORKSHOP_STATUS;
}

export interface IWorkshopQuery extends WorkshopSearchCriteria {
  limit?: number;
  skip?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export class WorkshopService {
  public createWorkshop = async (payload: ICreateWorkshopDTO, user: IUser): Promise<IWorkshop> => {
    const existing = await workshopRepository.findByCode(payload.code);
    if (existing) {
      throw new ConflictException(ERROR_MESSAGES.WORKSHOP_ALREADY_EXISTS);
    }

    if (payload.capacity <= 0) {
      throw new BadRequestException('Capacity must be at least 1');
    }

    const workshop = await workshopRepository.create({
      code: payload.code.toUpperCase().trim(),
      title: payload.title.trim(),
      description: payload.description?.trim(),
      category: payload.category.trim(),
      location: payload.location.trim(),
      instructor: payload.instructor.trim(),
      date: new Date(payload.date),
      capacity: payload.capacity,
      activeRegistrationsCount: 0,
      status: WORKSHOP_STATUS.SCHEDULED,
      createdBy: user.id
    });

    // Record audit trail
    try {
      await AuditLog.create({
        entityId: workshop._id,
        entityType: AUDIT_ENTITY_TYPE.WORKSHOP,
        actorId: new Types.ObjectId(user.id.length === 24 ? user.id : undefined),
        action: AUDIT_ACTION.CREATE,
        previousValues: {},
        newValues: workshop.toObject(),
        reason: `Workshop ${workshop.code} created by ${user.name}`,
        status: AUDIT_STATUS.SUCCESS,
        timestamp: new Date()
      });
    } catch {
      // Non-blocking audit failure
    }

    return workshop;
  };

  public updateWorkshop = async (
    id: string,
    payload: IUpdateWorkshopDTO,
    user: IUser
  ): Promise<IWorkshop> => {
    const workshop = await workshopRepository.findById(id);
    if (!workshop) {
      throw new NotFoundException(ERROR_MESSAGES.WORKSHOP_NOT_FOUND);
    }

    if (payload.capacity !== undefined) {
      if (payload.capacity < workshop.activeRegistrationsCount) {
        throw new BadRequestException(
          `Cannot reduce capacity to ${payload.capacity}. There are currently ${workshop.activeRegistrationsCount} active registrations.`
        );
      }
    }

    const previousValues = workshop.toObject();

    const { date, ...rest } = payload;
    const updateData: Partial<IWorkshop> = {
      ...rest,
      updatedBy: user.id,
      ...(date ? { date: new Date(date) } : {})
    };

    const updated = await workshopRepository.updateById(id, updateData);
    if (!updated) {
      throw new NotFoundException(ERROR_MESSAGES.WORKSHOP_NOT_FOUND);
    }

    // Record audit trail
    try {
      await AuditLog.create({
        entityId: workshop._id,
        entityType: AUDIT_ENTITY_TYPE.WORKSHOP,
        actorId: new Types.ObjectId(user.id.length === 24 ? user.id : undefined),
        action: AUDIT_ACTION.UPDATE,
        previousValues,
        newValues: updated.toObject(),
        reason: `Workshop ${workshop.code} updated by ${user.name}`,
        status: AUDIT_STATUS.SUCCESS,
        timestamp: new Date()
      });
    } catch {
      // Non-blocking audit failure
    }

    return updated;
  };

  public getWorkshopById = async (id: string): Promise<IWorkshop> => {
    const workshop = await workshopRepository.findByIdWithSeats(id);
    if (!workshop) {
      throw new NotFoundException(ERROR_MESSAGES.WORKSHOP_NOT_FOUND);
    }
    return workshop;
  };

  public listWorkshops = async (query: IWorkshopQuery) => {
    const {
      limit = 20,
      skip = 0,
      sort_by = 'date',
      sort_order = 'asc',
      search_key,
      from_date,
      to_date,
      status,
      category,
      location,
      has_available_seats
    } = query;

    return workshopRepository.searchWorkshops(
      { search_key, from_date, to_date, status, category, location, has_available_seats },
      { limit, skip, sort_by, sort_order: sort_order as ENTITY_SORT }
    );
  };
}

export const workshopService = new WorkshopService();
