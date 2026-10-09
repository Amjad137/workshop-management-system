import { IUser } from '@/types/user.type';

type UserLike = IUser | { userId?: IUser } | null | undefined;

/**
 * Gets user initials from first and last name
 */
export const getUserInitials = (user: UserLike): string => {
  if (!user) return 'NA';

  const userData = 'userId' in user ? user.userId : (user as IUser);
  if (!userData) return 'NA';

  const name = userData.name ?? '';
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'NA';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
};

/**
 * Gets formatted full name of a user
 */
export const getUserFullName = (user: UserLike): string => {
  if (!user) return 'Unknown';

  const userData = 'userId' in user ? user.userId : (user as IUser);
  if (!userData) return 'Unknown';

  return userData.name?.trim() || userData.email || 'Unknown';
};
