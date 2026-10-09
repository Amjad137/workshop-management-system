import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addAttendeeToWaitlist,
  cancelRegistration,
  fetchAllWaitlists,
  fetchRegistrations,
  fetchWorkshopHistory,
  fetchWorkshopWaitlist,
  promoteFromWaitlist,
  registerAttendee,
  removeFromWaitlist,
} from '@/services/registration.service';
import {
  ICancelRegistrationPayload,
  IRegisterAttendeePayload,
  IRegistrationQuery,
  IWaitlistQuery,
} from '@/types/registration.type';
import { toast } from './use-toast';

export const useGetAllRegistrations = (
  params?: IRegistrationQuery,
  options?: { enabled?: boolean },
) => {
  const { isLoading, data, error, refetch } = useQuery({
    queryKey: ['registrations', params],
    queryFn: () => fetchRegistrations(params),
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

export const useGetWorkshopHistory = (
  workshopId: string,
  options?: { enabled?: boolean },
) => {
  const { isLoading, data, error, refetch } = useQuery({
    queryKey: ['workshopHistory', workshopId],
    queryFn: () => fetchWorkshopHistory(workshopId),
    enabled: (options?.enabled ?? true) && Boolean(workshopId),
  });

  return {
    isLoading,
    data: data?.results ?? [],
    extras: data?.extras ?? { total: 0, limit: 200, skip: 0 },
    error,
    refetch,
  };
};

export const useRegisterAttendee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: IRegisterAttendeePayload) => registerAttendee(payload),
    onMutate: () => {
      toast({
        title: 'Registering Attendee',
        description: 'Checking seat availability atomically...',
      });
    },
    onSuccess: (data, variables) => {
      toast({
        title: 'Registration Confirmed! 🎉',
        description: `${data?.attendeeName} has been successfully registered.`,
      });
      queryClient.invalidateQueries({ queryKey: ['registrations'] });
      queryClient.invalidateQueries({ queryKey: ['workshops'] });
      queryClient.invalidateQueries({ queryKey: ['workshopHistory', variables.workshopId] });
      queryClient.invalidateQueries({ queryKey: ['workshopWithId', variables.workshopId] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-workshops'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-registrations'] });
    },
    onError: () => {
      // Surfaced in error handler
    },
  });
};

export const useCancelRegistration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload?: ICancelRegistrationPayload }) =>
      cancelRegistration(id, payload),
    onMutate: () => {
      toast({
        title: 'Processing Cancellation',
        description: 'Freeing workshop seat and recording audit trail...',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Registration Cancelled',
        description: 'The seat has been released and historical cancellation logged.',
      });
      queryClient.invalidateQueries({ queryKey: ['registrations'] });
      queryClient.invalidateQueries({ queryKey: ['workshops'] });
      queryClient.invalidateQueries({ queryKey: ['workshopHistory'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-workshops'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-registrations'] });
    },
    onError: () => {
      // Surfaced
    },
  });
};

export const useAddToWaitlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: IRegisterAttendeePayload) => addAttendeeToWaitlist(payload),
    onMutate: () => {
      toast({
        title: 'Adding to Waitlist',
        description: 'Queueing attendee for next available seat...',
      });
    },
    onSuccess: (data, variables) => {
      toast({
        title: 'Added to Waitlist',
        description: `${variables.attendeeName} is queued for this workshop.`,
      });
      queryClient.invalidateQueries({ queryKey: ['registrations'] });
      queryClient.invalidateQueries({ queryKey: ['waitlists'] });
      queryClient.invalidateQueries({ queryKey: ['workshopWaitlist', variables.workshopId] });
      queryClient.invalidateQueries({ queryKey: ['workshops'] });
    },
    onError: () => {
      // Surfaced
    },
  });
};

export const useGetAllWaitlists = (
  params?: IWaitlistQuery,
  options?: { enabled?: boolean },
) => {
  const { isLoading, data, error, refetch } = useQuery({
    queryKey: ['waitlists', params],
    queryFn: () => fetchAllWaitlists(params),
    enabled: options?.enabled ?? true,
  });

  return {
    isLoading,
    data: data?.results ?? [],
    extras: data?.extras ?? { total: 0, limit: 50, skip: 0 },
    error,
    refetch,
  };
};

export const useGetWorkshopWaitlist = (
  workshopId: string,
  options?: { enabled?: boolean },
) => {
  const { isLoading, data, error, refetch } = useQuery({
    queryKey: ['workshopWaitlist', workshopId],
    queryFn: () => fetchWorkshopWaitlist(workshopId),
    enabled: (options?.enabled ?? true) && Boolean(workshopId),
  });

  return {
    isLoading,
    data: data ?? [],
    error,
    refetch,
  };
};

export const useRemoveFromWaitlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (waitlistId: string) => removeFromWaitlist(waitlistId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waitlists'] });
      queryClient.invalidateQueries({ queryKey: ['workshopWaitlist'] });
    },
  });
};

export const usePromoteFromWaitlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (waitlistId: string) => promoteFromWaitlist(waitlistId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registrations'] });
      queryClient.invalidateQueries({ queryKey: ['waitlists'] });
      queryClient.invalidateQueries({ queryKey: ['workshopWaitlist'] });
      queryClient.invalidateQueries({ queryKey: ['workshops'] });
    },
  });
};

