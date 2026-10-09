import { ENTITY_SORT } from '@/constants/db.constants';
import { ERROR_MESSAGES } from '@/constants/error.constants';
import ConflictException from '@/exceptions/conflict.exception';
import NotFoundException from '@/exceptions/not-found.exception';
import BadRequestException from '@/exceptions/bad-request.exception';
import { IUser } from '@/models/auth.models';
import { IRegistration, REGISTRATION_STATUS } from '@/models/registration.model';
import { WORKSHOP_STATUS } from '@/models/workshop.model';
import { registrationRepository, RegistrationSearchCriteria } from '@/Repositories/registration.repository';
import { workshopRepository } from '@/Repositories/workshop.repository';
import { waitlistRepository } from '@/Repositories/waitlist.repository';
import { WAITLIST_STATUS } from '@/models/waitlist.model';
import { AuditLog } from '@/models/audit-log.model';
import { AUDIT_ACTION, AUDIT_ENTITY_TYPE, AUDIT_STATUS } from '@/constants/audit-log.constants';
import { Types } from 'mongoose';

export interface IRegisterAttendeeDTO {
  workshopId: string;
  attendeeName: string;
  attendeeEmail: string;
  notes?: string;
}

export interface ICancelRegistrationDTO {
  cancellationReason?: string;
}

export interface IRegistrationQuery extends RegistrationSearchCriteria {
  limit?: number;
  skip?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export class RegistrationService {
  /**
   * Register an attendee with 100% thread-safe atomic seat check.
   * Prevents overbooking across any number of concurrent requests.
   */
  public registerAttendee = async (
    payload: IRegisterAttendeeDTO,
    user: IUser
  ): Promise<IRegistration> => {
    const { workshopId, attendeeName, attendeeEmail, notes } = payload;

    if (!Types.ObjectId.isValid(workshopId)) {
      throw new BadRequestException(ERROR_MESSAGES.INVALID_OBJECT_ID);
    }

    // 1. Check if workshop exists and is open
    const workshop = await workshopRepository.findById(workshopId);
    if (!workshop) {
      throw new NotFoundException(ERROR_MESSAGES.WORKSHOP_NOT_FOUND);
    }

    if (workshop.status === WORKSHOP_STATUS.CANCELLED) {
      throw new BadRequestException(ERROR_MESSAGES.WORKSHOP_NOT_SCHEDULED);
    }

    // 2. Prevent duplicate active registration for the same attendee on this workshop
    const existingActive = await registrationRepository.findActiveByWorkshopAndEmail(
      workshopId,
      attendeeEmail
    );
    if (existingActive) {
      throw new ConflictException(ERROR_MESSAGES.ATTENDEE_ALREADY_REGISTERED);
    }

    // 3. ATOMIC SEAT RESERVATION:
    // Only increments if activeRegistrationsCount < capacity. Guaranteed single-operation atomic.
    const updatedWorkshop = await workshopRepository.atomicallyBookSeat(workshopId);
    if (!updatedWorkshop) {
      throw new ConflictException(ERROR_MESSAGES.WORKSHOP_AT_CAPACITY);
    }

    // 4. Create the persistent registration record
    try {
      const registration = await registrationRepository.create({
        workshopId: new Types.ObjectId(workshopId),
        attendeeName: attendeeName.trim(),
        attendeeEmail: attendeeEmail.toLowerCase().trim(),
        status: REGISTRATION_STATUS.REGISTERED,
        registeredBy: {
          id: user.id,
          name: user.name,
          email: user.email
        },
        registeredAt: new Date(),
        notes: notes?.trim()
      });

      // Audit log
      try {
        await AuditLog.create({
          entityId: registration._id,
          entityType: AUDIT_ENTITY_TYPE.REGISTRATION,
          actorId: new Types.ObjectId(user.id.length === 24 ? user.id : undefined),
          action: AUDIT_ACTION.CREATE,
          previousValues: {},
          newValues: registration.toObject(),
          reason: `Attendee ${attendeeName} registered by ${user.name} for workshop ${workshop.code}`,
          status: AUDIT_STATUS.SUCCESS,
          timestamp: new Date()
        });
      } catch {
        // Non-blocking audit failure
      }

      // If this attendee was queued on the waitlist for this workshop, promote them
      try {
        await waitlistRepository.markPromoted(workshopId, attendeeEmail);
      } catch {
        // Non-blocking waitlist update
      }

      return registration;
    } catch (error) {
      // Rollback the reserved seat if document creation failed
      await workshopRepository.atomicallyReleaseSeat(workshopId);
      throw error;
    }
  };

  /**
   * Cancel an attendee registration.
   * Seat is freed atomically, but the record is NEVER deleted.
   * Full historical trail with who cancelled and when is preserved.
   */
  public cancelRegistration = async (
    registrationId: string,
    reason: string | undefined,
    user: IUser
  ): Promise<{ registration: IRegistration; nextWaitlisted?: unknown }> => {
    if (!Types.ObjectId.isValid(registrationId)) {
      throw new BadRequestException(ERROR_MESSAGES.INVALID_OBJECT_ID);
    }

    const existing = await registrationRepository.findById(registrationId);
    if (!existing) {
      throw new NotFoundException(ERROR_MESSAGES.REGISTRATION_NOT_FOUND);
    }

    if (existing.status === REGISTRATION_STATUS.CANCELLED) {
      throw new ConflictException(ERROR_MESSAGES.REGISTRATION_ALREADY_CANCELLED);
    }

    const cancelledRegistration = await registrationRepository.cancelRegistration(
      registrationId,
      {
        id: user.id,
        name: user.name,
        email: user.email
      },
      reason
    );

    if (!cancelledRegistration) {
      throw new NotFoundException(ERROR_MESSAGES.REGISTRATION_NOT_FOUND);
    }

    // Atomically release the seat in the workshop
    await workshopRepository.atomicallyReleaseSeat(existing.workshopId);

    // Audit log
    try {
      await AuditLog.create({
        entityId: cancelledRegistration._id,
        entityType: AUDIT_ENTITY_TYPE.REGISTRATION,
        actorId: new Types.ObjectId(user.id.length === 24 ? user.id : undefined),
        action: AUDIT_ACTION.DELETE,
        previousValues: existing.toObject(),
        newValues: cancelledRegistration.toObject(),
        reason: `Registration cancelled by ${user.name}${reason ? `: ${reason}` : ''}`,
        status: AUDIT_STATUS.SUCCESS,
        timestamp: new Date()
      });
    } catch {
      // Non-blocking audit failure
    }

    // Check Waitlist: If anyone is queued, offer or notify
    const nextWaitlisted = await waitlistRepository.getNextInLine(existing.workshopId);

    return {
      registration: cancelledRegistration,
      nextWaitlisted: nextWaitlisted ?? null
    };
  };

  /**
   * List all registrations with filters (workshop, status, attendee email, search)
   */
  public listRegistrations = async (query: IRegistrationQuery) => {
    const {
      limit = 20,
      skip = 0,
      sort_by = 'registeredAt',
      sort_order = 'desc',
      workshopId,
      status,
      attendeeEmail,
      search_key
    } = query;

    return registrationRepository.searchRegistrations(
      { workshopId, status, attendeeEmail, search_key },
      { limit, skip, sort_by, sort_order: sort_order as ENTITY_SORT }
    );
  };

  /**
   * Get full registration history for a workshop (active + cancelled)
   */
  public getHistoryByWorkshopId = async (workshopId: string) => {
    if (!Types.ObjectId.isValid(workshopId)) {
      throw new BadRequestException(ERROR_MESSAGES.INVALID_OBJECT_ID);
    }

    return registrationRepository.searchRegistrations(
      { workshopId },
      { limit: 200, skip: 0, sort_by: 'registeredAt', sort_order: 'desc' as ENTITY_SORT }
    );
  };

  /**
   * Add attendee to waitlist when workshop is full
   */
  public addToWaitlist = async (payload: IRegisterAttendeeDTO, user: IUser) => {
    const { workshopId, attendeeName, attendeeEmail, notes } = payload;

    if (!Types.ObjectId.isValid(workshopId)) {
      throw new BadRequestException(ERROR_MESSAGES.INVALID_OBJECT_ID);
    }

    const workshop = await workshopRepository.findById(workshopId);
    if (!workshop) {
      throw new NotFoundException(ERROR_MESSAGES.WORKSHOP_NOT_FOUND);
    }

    if (workshop.status === WORKSHOP_STATUS.CANCELLED) {
      throw new BadRequestException(ERROR_MESSAGES.WORKSHOP_NOT_SCHEDULED);
    }

    // 1. Prevent waitlisting if attendee already has an active confirmed seat
    const existingRegistration = await registrationRepository.findActiveByWorkshopAndEmail(
      workshopId,
      attendeeEmail
    );
    if (existingRegistration) {
      throw new ConflictException(ERROR_MESSAGES.ATTENDEE_ALREADY_CONFIRMED);
    }

    // 2. Prevent waitlisting if attendee is already actively on the waitlist
    const existingWaitlist = await waitlistRepository.findActiveByWorkshopAndEmail(
      workshopId,
      attendeeEmail
    );
    if (existingWaitlist) {
      throw new ConflictException(ERROR_MESSAGES.ATTENDEE_ALREADY_WAITLISTED);
    }

    return waitlistRepository.create({
      workshopId: new Types.ObjectId(workshopId),
      attendeeName: attendeeName.trim(),
      attendeeEmail: attendeeEmail.toLowerCase().trim(),
      status: WAITLIST_STATUS.WAITING,
      registeredBy: { id: user.id, name: user.name, email: user.email },
      registeredAt: new Date(),
      notes: notes?.trim()
    });
  };

  public getWaitlistByWorkshopId = async (workshopId: string) => {
    return waitlistRepository.findActiveByWorkshop(workshopId);
  };

  /**
   * Get all active waitlist entries with workshop details (optionally filtered by workshopId or search)
   */
  public getAllWaitlists = async (query: {
    workshopId?: string;
    search_key?: string;
    limit?: number;
    skip?: number;
  }) => {
    const { Waitlist } = await import('@/models/waitlist.model');
    const filter: Record<string, unknown> = {
      status: WAITLIST_STATUS.WAITING
    };

    if (query.workshopId && Types.ObjectId.isValid(query.workshopId)) {
      filter.workshopId = new Types.ObjectId(query.workshopId);
    }

    if (query.search_key) {
      filter.$or = [
        { attendeeName: { $regex: query.search_key, $options: 'i' } },
        { attendeeEmail: { $regex: query.search_key, $options: 'i' } }
      ];
    }

    const limit = query.limit || 50;
    const skip = query.skip || 0;

    const [results, total] = await Promise.all([
      Waitlist.find(filter)
        .populate('workshopId', 'title code location date capacity activeRegistrationsCount status')
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(limit),
      Waitlist.countDocuments(filter)
    ]);

    return {
      results,
      extras: { total, limit, skip }
    };
  };

  /**
   * Remove/cancel an attendee from the waitlist
   */
  public removeFromWaitlist = async (waitlistId: string) => {
    if (!Types.ObjectId.isValid(waitlistId)) {
      throw new BadRequestException(ERROR_MESSAGES.INVALID_OBJECT_ID);
    }

    const { Waitlist } = await import('@/models/waitlist.model');
    const item = await Waitlist.findById(waitlistId);
    if (!item) {
      throw new NotFoundException('Waitlist entry not found.');
    }

    await Waitlist.findByIdAndUpdate(waitlistId, {
      $set: { status: WAITLIST_STATUS.CANCELLED }
    });

    return { message: 'Attendee successfully removed from waitlist.' };
  };

  /**
   * Promote an attendee from the waitlist into a confirmed registration
   */
  public promoteFromWaitlist = async (waitlistId: string, user: IUser) => {
    if (!Types.ObjectId.isValid(waitlistId)) {
      throw new BadRequestException(ERROR_MESSAGES.INVALID_OBJECT_ID);
    }

    const { Waitlist } = await import('@/models/waitlist.model');
    const item = await Waitlist.findById(waitlistId);
    if (!item || item.status !== WAITLIST_STATUS.WAITING) {
      throw new BadRequestException('Attendee is no longer on the active waiting queue.');
    }

    // Attempt to register the attendee into the workshop (atomically checks capacity)
    const registration = await this.registerAttendee(
      {
        workshopId: item.workshopId.toString(),
        attendeeName: item.attendeeName,
        attendeeEmail: item.attendeeEmail,
        notes: item.notes ? `Promoted from queue. ${item.notes}` : 'Promoted from queue'
      },
      user
    );

    // Mark waitlist as PROMOTED
    await Waitlist.findByIdAndUpdate(waitlistId, {
      $set: { status: WAITLIST_STATUS.PROMOTED }
    });

    return registration;
  };
}

export const registrationService = new RegistrationService();
