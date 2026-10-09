import { ORG_ROLES } from '@/constants/auth.constants';
import { SYSTEM_ROLE } from '@/constants/user.constants';
import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { APIError } from 'better-auth/api';
import { admin, organization, username } from 'better-auth/plugins';
import type { Organization as OrgPlugin, Member, Invitation } from 'better-auth/plugins';
import { getMongoClient, getMongoDb } from '../db.config';
import environment from '../env.config';
import { ac, adminRole, managerRole, staffRole, owner, manager, staff } from './permissions';

export const auth = betterAuth({
  baseURL: environment.apiUrl,
  basePath: 'v1/auth',
  secret: environment.betterAuthSecret,

  trustedOrigins: [environment.clientUrl],

  database: mongodbAdapter(getMongoDb(), {
    client: getMongoClient()
  }),

  databaseHooks: {
    user: {
      create: {
        before: async (user, ctx) => {
          const invitationCode = ctx?.body?.invitationCode as string | undefined;
          if (invitationCode) {
            const { userInvitationRepository } = await import(
              '@/Repositories/user-invitation.repository'
            );
            const invitation = await userInvitationRepository.findByCode(invitationCode);
            if (!invitation || invitation.isUsed || invitation.expiresAt < new Date()) {
              throw new APIError('BAD_REQUEST', {
                message: 'Invalid, expired, or already used invitation code.'
              });
            }

            if (user.email.toLowerCase() !== invitation.email.toLowerCase()) {
              throw new APIError('BAD_REQUEST', {
                message: 'Email address does not match the invitation.'
              });
            }

            return {
              data: {
                ...user,
                role: invitation.role
              }
            };
          }
        },
        after: async (user, ctx) => {
          const invitationCode = ctx?.body?.invitationCode as string | undefined;
          if (invitationCode) {
            const { userInvitationRepository } = await import(
              '@/Repositories/user-invitation.repository'
            );
            await userInvitationRepository.markAsUsed(invitationCode, user.id);
          }
        }
      }
    }
  },

  user: {
    additionalFields: {
      phoneNumber: {
        type: 'string',
        required: true
      },
      role: {
        type: 'string',
        required: true,
        defaultValue: SYSTEM_ROLE.STAFF
      }
    }
  },

  session: {
    expiresIn: 60 * 60 * 24,
    updateAge: 60 * 60,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5
    }
  },

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 8
  },

  plugins: [
    admin({
      defaultRole: SYSTEM_ROLE.STAFF,
      adminRoles: [SYSTEM_ROLE.ADMIN],
      roles: {
        [SYSTEM_ROLE.ADMIN]: adminRole,
        [SYSTEM_ROLE.MANAGER]: managerRole,
        [SYSTEM_ROLE.STAFF]: staffRole
      }
    }),

    username({
      minUsernameLength: 5,
      maxUsernameLength: 25
    }),

    organization({
      ac,
      roles: {
        [ORG_ROLES.OWNER]: owner,
        [ORG_ROLES.MANAGER]: manager,
        [ORG_ROLES.STAFF]: staff
      },
      creatorRole: ORG_ROLES.OWNER,
      allowUserToCreateOrganization: async (user) =>
        (user as unknown as { userRole?: string }).userRole === ORG_ROLES.OWNER,
      membershipLimit: 50,
      schema: {
        organization: {
          additionalFields: {
            address: {
              type: 'string',
              required: true
            }
          }
        },
        member: {
          additionalFields: {}
        }
      },

      organizationHooks: {
        beforeCreateInvitation: async ({ invitation, organization }) => {
          if (invitation.role === ORG_ROLES.OWNER) {
            const orgWithMembers = organization as unknown as {
              members?: Array<{ role: string }>;
            };
            const existingMembers = orgWithMembers.members ?? [];
            const hasOwner = existingMembers.some(
              (m: { role: string }) => m.role === ORG_ROLES.OWNER
            );
            if (hasOwner) {
              throw new Error('Each organization can only have one owner.');
            }
          }
        }
      },

      sendInvitationEmail: async ({ email, id, organization, inviter }) => {
        const url = new URL('/login', environment.clientUrl);
        url.searchParams.set('invitationId', id);
        url.searchParams.set('email', email);
        console.log(
          `[BetterAuth Invitation] Invite for ${organization.name} to ${email} (URL: ${url.toString()}) sent by ${inviter.user.name}`
        );
      }
    })
  ],

  onAPIError: {
    onError(error, ctx) {
      if (error instanceof APIError) return;
      console.error('[BetterAuth Error]', error, { ctx });
    }
  }
});

export type Session = typeof auth.$Infer.Session & {
  user: typeof auth.$Infer.Session['user'] & {
    phoneNumber?: string;
    role?: string;
    banned?: boolean | null;
  };
};
export type Organization = OrgPlugin;
export type OrganizationMember = Member;
export type OrganizationMemberRole = string;
export type OrganizationInvitationStatus = Invitation['status'];
