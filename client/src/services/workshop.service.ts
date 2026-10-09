import Axios from '@/config/api.config';
import { ICommonResponseDTO, IPaginatedResponseDTO, IBasePaginationExtras } from '@/dto/common.dto';
import {
  ICreateWorkshopPayload,
  IUpdateWorkshopPayload,
  IWorkshop,
  IWorkshopQuery,
} from '@/types/workshop.type';
import { toast } from '@/hooks/use-toast';
import ErrorHandler from '@/utils/error-handler';
import { AxiosError } from 'axios';

export const fetchWorkshops = async (params?: IWorkshopQuery) => {
  try {
    const response = await Axios.get<
      ICommonResponseDTO<IPaginatedResponseDTO<IWorkshop, IBasePaginationExtras>>
    >('/v1/workshop', {
      params,
    });

    return response.data.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      const { errorMessage } = ErrorHandler(err);
      toast({
        title: 'Error!',
        description: errorMessage,
        variant: 'destructive',
      });
    }
    throw err;
  }
};

export const fetchWorkshopById = async (id: string) => {
  try {
    const response = await Axios.get<ICommonResponseDTO<IWorkshop>>(`/v1/workshop/${id}`);
    return response.data.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      const { errorMessage } = ErrorHandler(err);
      toast({
        title: 'Error!',
        description: errorMessage,
        variant: 'destructive',
      });
    }
    throw err;
  }
};

export const createWorkshop = async (payload: ICreateWorkshopPayload) => {
  try {
    const response = await Axios.post<ICommonResponseDTO<IWorkshop>>('/v1/workshop', payload);
    toast({
      title: 'Workshop Created',
      description: `Workshop ${response.data.data?.code} created successfully.`,
    });
    return response.data.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      const { errorMessage } = ErrorHandler(err);
      toast({
        title: 'Error!',
        description: errorMessage,
        variant: 'destructive',
      });
    }
    throw err;
  }
};

export const updateWorkshop = async (id: string, payload: IUpdateWorkshopPayload) => {
  try {
    const response = await Axios.patch<ICommonResponseDTO<IWorkshop>>(
      `/v1/workshop/${id}`,
      payload,
    );
    toast({
      title: 'Workshop Updated',
      description: `Workshop updated successfully.`,
    });
    return response.data.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      const { errorMessage } = ErrorHandler(err);
      toast({
        title: 'Error!',
        description: errorMessage,
        variant: 'destructive',
      });
    }
    throw err;
  }
};
