import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createInvitation,
  fetchAllInvitations,
  revokeInvitation,
  validateInvitationCode,
} from '@/services/invitation.service';
import { ICreateInvitationPayload, IInvitationQuery } from '@/types/invitation.type';
import { toast } from './use-toast';

export const useGetAllInvitations = (
  params?: IInvitationQuery,
  options?: { enabled?: boolean },
) => {
  const { isLoading, data, error, refetch } = useQuery({
    queryKey: ['invitations', params],
    queryFn: () => fetchAllInvitations(params),
    enabled: options?.enabled ?? true,
  });

  return {
    isLoading,
    data: data?.results ?? [],
    extras: data?.extras ?? { total: 0, limit: 20, skip: 0 },
    error,
    refetch,
  };
};

export const useCreateInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ICreateInvitationPayload) => createInvitation(payload),
    onMutate: () => {
      toast({
        title: 'Generating Invitation',
        description: 'Creating secure invitation token...',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
    },
  });
};

export const useRevokeInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => revokeInvitation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
    },
  });
};

export const useValidateInvitationCode = (code: string | null | undefined) => {
  return useQuery({
    queryKey: ['invitation-validate', code],
    queryFn: () => validateInvitationCode(code ?? ''),
    enabled: Boolean(code && code.trim().length > 0),
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
};

