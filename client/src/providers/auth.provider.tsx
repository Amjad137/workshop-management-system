'use client';

import PageLoader from '@/components/saas/shared/page-loader';
import { useSession } from '@/hooks/use-auth';
import { useAuthStore } from '@/stores/auth.store';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { loading, isInitialized } = useAuthStore();

  useSession();

  // Show loader while initializing
  if (!isInitialized || loading) {
    return <PageLoader />;
  }

  return <>{children}</>;
};
