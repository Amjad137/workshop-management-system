import { ROUTES } from '@/constants/routes.constants';
import { USER_ROLE } from '@/constants/user.constants';
import { authClient } from '@/config/better-auth/auth.client';
import { useAuthStore } from '@/stores/auth.store';
import { getErrorMessage } from '@/utils/error-handler';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { toast } from './use-toast';

type SignInPayload = {
  email: string;
  password: string;
};

type SignUpPayload = {
  email: string;
  password: string;
  name: string;
  phoneNumber: string;
  address: string;
  image?: string;
};

type ResetPasswordPayload = {
  token: string;
  newPassword: string;
};

type RequestPasswordResetPayload = {
  email: string;
  redirectTo: string;
};

export const useSession = () => {
  const {
    setUser,
    setUserRole,
    setIsAuthenticated,
    setIsInitialized,
    setLoading,
    clearSensitiveData,
  } = useAuthStore();

  const query = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await authClient.getSession();
      return data ?? null;
    },
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    setLoading(query.isLoading);
  }, [query.isLoading, setLoading]);

  useEffect(() => {
    if (query.isSuccess) {
      if (query.data?.user) {
        setUser(query.data.user);
        setUserRole(query.data.user.role as USER_ROLE);
        setIsAuthenticated(true);
      } else {
        clearSensitiveData();
      }
      setIsInitialized(true);
    }
  }, [
    query.isSuccess,
    query.data,
    clearSensitiveData,
    setIsInitialized,
    setIsAuthenticated,
    setUser,
    setUserRole,
  ]);

  useEffect(() => {
    if (query.isError) {
      clearSensitiveData();
      setIsInitialized(true);
    }
  }, [query.isError, clearSensitiveData, setIsInitialized]);

  return query;
};

export const useSignIn = () => {
  const queryClient = useQueryClient();
  const { setUser, setUserRole, setIsAuthenticated, setIsInitialized } = useAuthStore();

  return useMutation({
    mutationFn: async (payload: SignInPayload) => {
      const { error } = await authClient.signIn.email(payload);
      if (error) throw new Error(error.message ?? 'Unable to sign in');

      const { data: session } = await authClient.getSession();
      return session ?? null;
    },
    onSuccess: (session) => {
      if (session?.user) {
        setUser(session.user);
        setUserRole(session.user.role as USER_ROLE);
        setIsAuthenticated(true);
        setIsInitialized(true);
        queryClient.invalidateQueries({ queryKey: ['session'] });
      }

      toast({
        title: 'Welcome Back!',
        description: 'You have successfully signed in to your account.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error!',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
};

export const useSignUp = () => {
  const queryClient = useQueryClient();
  const { setUser, setUserRole, setIsAuthenticated, setIsInitialized } = useAuthStore();

  return useMutation({
    mutationFn: async (payload: SignUpPayload) => {
      const { error } = await authClient.signUp.email(payload);
      if (error) throw new Error(error.message ?? 'Unable to sign up');

      const { data: session } = await authClient.getSession();
      return session ?? null;
    },
    onSuccess: (session) => {
      if (session?.user) {
        setUser(session.user);
        setUserRole(session.user.role as USER_ROLE);
        setIsAuthenticated(true);
        setIsInitialized(true);
        queryClient.invalidateQueries({ queryKey: ['session'] });
      }

      toast({
        title: 'Account Created',
        description: 'Account created successfully!',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error!',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
};

export const useSignOut = () => {
  const queryClient = useQueryClient();
  const { clearSensitiveData } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      const { error } = await authClient.signOut();
      if (error) throw new Error(error.message ?? 'Unable to sign out');
    },
    onSuccess: () => {
      clearSensitiveData();
      queryClient.clear();
      if (typeof window !== 'undefined') {
        window.location.href = ROUTES.SIGN_IN;
      }
      toast({
        title: 'See You Soon!',
        description: 'Signed out successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error!',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
};

export const useRequestPasswordReset = () => {
  return useMutation({
    mutationFn: async (payload: RequestPasswordResetPayload) => {
      const { data, error } = await authClient.requestPasswordReset(payload);
      if (error) throw new Error(error.message ?? 'Unable to send reset link');
      return data;
    },
    onError: (error) => {
      toast({
        title: 'Error!',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: async (payload: ResetPasswordPayload) => {
      const { data, error } = await authClient.resetPassword(payload);
      if (error) throw new Error(error.message ?? 'Unable to reset password');
      return data;
    },
    onError: (error) => {
      toast({
        title: 'Error!',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
};

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: async ({
      currentPassword,
      newPassword,
      revokeOtherSessions = false,
    }: {
      currentPassword: string;
      newPassword: string;
      revokeOtherSessions?: boolean;
    }) => {
      const { data, error } = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions,
      });
      if (error) throw new Error(error.message ?? 'Unable to update password');
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'Password updated successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error!',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
};


