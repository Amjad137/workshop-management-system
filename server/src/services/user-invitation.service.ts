import { ENTITY_SORT } from '@/constants/db.constants';
import { ERROR_MESSAGES } from '@/constants/error.constants';
import ConflictException from '@/exceptions/conflict.exception';
import NotFoundException from '@/exceptions/not-found.exception';
import BadRequestException from '@/exceptions/bad-request.exception';
import { IUser } from '@/models/auth.models';
import { IUserInvitation } from '@/models/user-invitation.model';
import { userInvitationRepository } from '@/Repositories/user-invitation.repository';
import { userRepository } from '@/Repositories/user.repository';
import {
  ICreateInvitationInput,
  IInvitationQuery
} from '@/validators/user-invitation.validator';
import { Types } from 'mongoose';
import crypto from 'node:crypto';

export class UserInvitationService {
  /**
   * Create an email invitation for a new Staff or Manager account.
   */
  public createInvitation = async (
    payload: ICreateInvitationInput,
    adminUser: IUser
  ): Promise<IUserInvitation> => {
    const email = payload.email.toLowerCase().trim();

    // 1. Check if user already exists
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('A user account already exists with this email address.');
    }

    // 2. Check if a pending, unexpired invitation already exists for this email
    const pendingInvitation = await userInvitationRepository.findPendingByEmail(email);
    if (pendingInvitation) {
      throw new ConflictException(
        'An active invitation has already been sent to this email address.'
      );
    }

    // 3. Generate unique invitation code and 14-day expiry
    const invitationCode = 'inv_' + crypto.randomBytes(12).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 14);

    return userInvitationRepository.create({
      invitationCode,
      email,
      role: payload.role,
      isUsed: false,
      expiresAt,
      createdById: new Types.ObjectId(adminUser.id.length === 24 ? adminUser.id : undefined)
    });
  };

  /**
   * List invitations with search and filters
   */
  public getAllInvitations = async (query: IInvitationQuery) => {
    const {
      search_key,
      role,
      isUsed,
      limit = 20,
      skip = 0,
      sort_by = 'createdAt',
      sort_order = 'desc'
    } = query;

    return userInvitationRepository.search(
      { search_key, role, isUsed },
      { limit, skip, sort_by, sort_order: sort_order as ENTITY_SORT }
    );
  };

  /**
   * Revoke/delete an invitation by ID
   */
  public revokeInvitation = async (id: string): Promise<boolean> => {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(ERROR_MESSAGES.INVALID_OBJECT_ID);
    }

    const invitation = await userInvitationRepository.findById(id);
    if (!invitation) {
      throw new NotFoundException('Invitation not found.');
    }

    await userInvitationRepository.deleteOne({ _id: new Types.ObjectId(id) });
    return true;
  };

  /**
   * Validate an invitation code (public endpoint for signup verification)
   */
  public validateInvitationCode = async (code: string) => {
    const invitation = await userInvitationRepository.findByCode(code);
    if (!invitation || invitation.isUsed || invitation.expiresAt < new Date()) {
      throw new BadRequestException('Invalid, expired, or already used invitation code.');
    }

    return {
      invitationCode: invitation.invitationCode,
      email: invitation.email,
      role: invitation.role,
      expiresAt: invitation.expiresAt
    };
  };
}

export const userInvitationService = new UserInvitationService();
export default userInvitationService;
