import { SYSTEM_ROLE } from '@/constants/user.constants';
import userInvitationRepository from '@/repositories/user-invitation.repository';
import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { APIError } from 'better-auth/api';
import { admin, username } from 'better-auth/plugins';
import { getMongoClient, getMongoDb } from '../db.config';
import environment from '../env.config';

export const auth = betterAuth({
  baseURL: environment.apiUrl,
  basePath: 'v1/auth',
  secret: environment.betterAuthSecret,

  trustedOrigins: [environment.clientUrl],

  advanced: {
    useSecureCookies: !environment.isDebugMode,
    crossSubDomainCookies: {
      enabled: Boolean(environment.cookieDomain),
      domain: environment.cookieDomain
    }
  },

  database: mongodbAdapter(getMongoDb(), {
    client: getMongoClient()
  }),

  databaseHooks: {
    user: {
      create: {
        before: async (user, ctx) => {
          const invitationCode = ctx?.body?.invitationCode as string | undefined;
          const referralSource =
            (ctx?.body?.referralSource as string | undefined) ||
            ((user as Record<string, unknown>).referralSource as string | undefined);
          const address =
            (ctx?.body?.address as string | undefined) ||
            ((user as Record<string, unknown>).address as string | undefined);

          if (!invitationCode) {
            throw new APIError('BAD_REQUEST', {
              message: 'Registration is by invitation only. A valid invitation code is required.'
            });
          }

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
              role: invitation.role,
              ...(address ? { address } : {}),
              referralSource: referralSource || 'invitation'
            }
          };
        },
        after: async (user, ctx) => {
          const invitationCode = ctx?.body?.invitationCode as string | undefined;
          if (invitationCode) {
            await userInvitationRepository.markAsUsed(invitationCode, user.id);
          }

          // Auto-create a skeleton Mentor profile on mentor signup.
          // The mentor will complete their profile during the onboarding flow.
          if ((user as Record<string, unknown>).role === SYSTEM_ROLE.MENTOR) {
            try {
              const { mentorRepository } = await import('@/repositories/mentor.repository');
              await mentorRepository.createSkeletonProfile(user.id);
            } catch (err) {
              // Log but never block signup — profile can be created manually by admin as fallback
              console.error('[BetterAuth] Failed to auto-create mentor skeleton profile:', err);
            }
          }
        }
      }
    }
  },

  experimental: { joins: true },

  user: {
    additionalFields: {
      phoneNumber: {
        type: 'string',
        required: true
      },
      address: {
        type: 'string',
        required: true
      },
      role: {
        type: 'string',
        required: true,
        defaultValue: SYSTEM_ROLE.STUDENT
      },
      referralSource: {
        type: 'string',
        required: false
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
    admin(),

    username({
      minUsernameLength: 5,
      maxUsernameLength: 25
    })
  ],

  onAPIError: {
    onError(error, ctx) {
      if (error instanceof APIError) return;
      console.error('[BetterAuth Error]', error, { ctx });
    }
  }
});

export type Session = typeof auth.$Infer.Session;
