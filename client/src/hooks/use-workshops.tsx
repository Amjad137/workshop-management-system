import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createWorkshop,
  fetchWorkshopById,
  fetchWorkshops,
  updateWorkshop,
} from '@/services/workshop.service';
import {
  ICreateWorkshopPayload,
  IUpdateWorkshopPayload,
  IWorkshopQuery,
} from '@/types/workshop.type';
import { toast } from './use-toast';

export const useGetAllWorkshops = (
  params?: IWorkshopQuery,
  options?: { enabled?: boolean },
) => {
  const { isLoading, data, error, refetch } = useQuery({
    queryKey: ['workshops', params],
    queryFn: () => fetchWorkshops(params),
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

export const useGetWorkshopById = (
  workshopId: string,
  options?: { enabled?: boolean },
) => {
  const { isLoading, data, error, refetch } = useQuery({
    queryKey: ['workshopWithId', workshopId],
    queryFn: () => fetchWorkshopById(workshopId),
    enabled: (options?.enabled ?? true) && Boolean(workshopId),
  });

  return {
    isLoading,
    data: data ?? null,
    error,
    refetch,
  };
};

export const useCreateWorkshop = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ICreateWorkshopPayload) => createWorkshop(payload),
    onMutate: () => {
      toast({
        title: 'Creating Workshop',
        description: 'Scheduling new workshop in catalogue...',
      });
    },
    onSuccess: (data) => {
      toast({
        title: 'Workshop Scheduled! 🎉',
        description: `Workshop ${data?.code} created successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ['workshops'] });
    },
    onError: () => {
      // Toast handled or surfaced
    },
  });
};

export const useUpdateWorkshop = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: IUpdateWorkshopPayload }) =>
      updateWorkshop(id, payload),
    onMutate: () => {
      toast({
        title: 'Updating Workshop',
        description: 'Saving workshop updates...',
      });
    },
    onSuccess: (data, variables) => {
      toast({
        title: 'Workshop Updated',
        description: `Workshop ${data?.code || ''} updated successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ['workshopWithId', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['workshops'] });
    },
    onError: () => {
      // Toast handled
    },
  });
};
