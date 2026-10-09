import { authClient } from '@/config/better-auth/auth.client';
import { Session } from '@/config/better-auth/auth.types';
import { NextRequest } from 'next/server';

export const getSession = async (req: NextRequest): Promise<Session | null> => {
  const { data: response } = await authClient.getSession({
    fetchOptions: {
      headers: { cookie: req.headers.get('cookie') ?? '' },
    },
  });
  return response ?? null;
};
