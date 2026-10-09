import { ENTITY_SORT } from '@/constants/db.constants';
import { FilterQuery } from 'mongoose';
import { BaseRepository } from './base.repository';
import { IUserInvitation, UserInvitation, UserInvitationModel } from '@/models/user-invitation.model';

export interface UserInvitationSearchCriteria {
    search_key?: string;
    role?: string;
    isUsed?: boolean;
}

export class UserInvitationRepository extends BaseRepository<IUserInvitation, UserInvitationModel> {
    constructor() {
        super(UserInvitation);
    }

    public findByCode = async (invitationCode: string) => this.findOne({ invitationCode });

    public findByEmail = async (email: string) => this.findAll({ email: email.toLowerCase() });

    public findPendingByEmail = async (email: string) =>
        this.findOne({
            email: email.toLowerCase(),
            isUsed: false,
            expiresAt: { $gt: new Date() }
        });

    public markAsUsed = async (invitationCode: string, userId: string) =>
        this.updateOne(
            { invitationCode },
            {
                $set: {
                    isUsed: true,
                    usedAt: new Date(),
                    usedBy: userId
                }
            }
        );

    public search = async (
        criteria: UserInvitationSearchCriteria,
        options: { limit?: number; skip?: number; sort_by?: string; sort_order?: ENTITY_SORT }
    ) => {
        const filters: FilterQuery<IUserInvitation> = {};
        const { search_key, role, isUsed } = criteria;

        if (role) {
            filters.role = role;
        }

        if (typeof isUsed !== 'undefined') {
            filters.isUsed = isUsed;
        }

        if (search_key) {
            filters.$or = [
                { email: { $regex: search_key, $options: 'i' } },
                { invitationCode: { $regex: search_key, $options: 'i' } }
            ];
        }

        return this.findAll(filters, options);
    };
}

export const userInvitationRepository = new UserInvitationRepository();
export default userInvitationRepository;
