import { ISignupFormValues } from '@/components/saas/auth/sign-up/schema/sign-up.schema';
import { IUserQuery } from '@/dto/user.dto';
import {
  createUserAccount,
  deleteUserById,
  fetchAllUsers,
  fetchAllUsersCount,
  fetchUserById,
  ICreateUserPayload,
  updateMultipleUserStatus,
  updateUser,
  updateUserByAdmin,
  verifyMultipleUsers,
} from '@/services/user.service';
import { useAuthStore } from '@/stores/auth.store';
import { DeepPartial } from '@/types/common.type';
import { IUser } from '@/types/user.type';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from './use-toast';

export const useGetAllUsers = (params?: IUserQuery, options?: { enabled?: boolean }) => {
  const { isLoading, data, error } = useQuery({
    queryKey: ['users', params],
    queryFn: () => fetchAllUsers(params),
    enabled: options?.enabled ?? true,
  });

  return {
    isLoading,
    data: data?.results ?? [],
    extras: data?.extras ?? { total: 0, limit: 24, skip: 0 },
    error,
  };
};

export const useGetAllUsersCount = (options?: { enabled?: boolean }) => {
  const { isLoading, data, error } = useQuery({
    queryKey: ['usersCount'],
    queryFn: () => fetchAllUsersCount(),
    enabled: options?.enabled ?? true,
  });

  return {
    isLoading,
    data: data ?? 0,
    error,
  };
};

export const useGetUserById = (userId: string, options?: { enabled?: boolean }) => {
  const { isLoading, data, error } = useQuery({
    queryKey: ['userWithId', userId],
    queryFn: () => fetchUserById(userId),
    enabled: options?.enabled ?? true,
  });

  return {
    isLoading,
    data: data ?? null,
    error,
  };
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      userData,
    }: {
      userId: string;
      userData: DeepPartial<ISignupFormValues>;
    }) => updateUser(userId, userData),
    onMutate: () => {
      toast({
        title: 'Updating',
        description: 'Updating user...',
      });
    },
    onSuccess: (data, variables) => {
      // Update auth store if updating current user
      const { user: currentUser, updateUser: updateAuthUser } = useAuthStore.getState();
      if (currentUser && currentUser.id === variables.userId) {
        updateAuthUser(variables.userData as Partial<IUser>);
      }

      toast({
        title: 'Success',
        description: 'Updated user successfully',
      });
      queryClient.invalidateQueries({
        queryKey: ['userWithId', variables.userId],
      });

      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useUpdateUserByAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      userData,
    }: {
      userId: string;
      userData: Omit<ISignupFormValues, 'password' | 'confirmPassword' | 'entryCode'>;
    }) => updateUserByAdmin(userId, userData),
    onMutate: () => {
      toast({
        title: 'Updating',
        description: 'Updating user...',
      });
    },
    onSuccess: (data, variables) => {
      toast({
        title: 'Success',
        description: 'Updated user successfully',
      });
      queryClient.invalidateQueries({
        queryKey: ['userWithId', variables.userId],
      });

      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update user',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userIDs, status }: { userIDs: string[]; status: boolean }) =>
      updateMultipleUserStatus(userIDs, status),
    onMutate: () => {
      toast({
        title: 'Updating',
        description: 'Updating user status...',
      });
    },
    onSuccess: (data, variables) => {
      toast({
        title: 'Success',
        description: 'Status updated successfully',
      });
      variables.userIDs.forEach((userId) => {
        queryClient.invalidateQueries({
          queryKey: ['userWithId', userId],
        });
      });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useVerifyUsers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userIDs, verification }: { userIDs: string[]; verification: string }) =>
      verifyMultipleUsers(userIDs, verification),
    onMutate: ({ verification }) => {
      toast({
        title: verification ? 'Verifying' : 'Non-verifying',
        description: 'Updating user...',
      });
    },
    onSuccess: (data, variables) => {
      toast({
        title: 'Success',
        description: 'Updated successfully',
      });
      variables.userIDs.forEach((userId) => {
        queryClient.invalidateQueries({
          queryKey: ['userWithId', userId],
        });
      });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId }: { userId: string }) => deleteUserById(userId),
    onMutate: () => {
      toast({
        title: 'Deleting',
        description: 'Deleting the user...',
      });
    },
    onSuccess: (data, variables) => {
      toast({
        title: 'Success',
        description: 'Deleted the user successfully',
      });
      queryClient.invalidateQueries({
        queryKey: ['userWithId', variables.userId],
      });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['usersCount'] });
    },
  });
};

export const useCreateUserAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ICreateUserPayload) => createUserAccount(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['usersCount'] });
    },
  });
};

