import Axios from '@/config/api.config';
import { ICommonResponseDTO, IPaginatedResponseDTO, IBasePaginationExtras } from '@/dto/common.dto';
import {
  ICancelRegistrationPayload,
  IRegisterAttendeePayload,
  IRegistration,
  IRegistrationQuery,
} from '@/types/registration.type';
import { toast } from '@/hooks/use-toast';
import ErrorHandler from '@/utils/error-handler';
import { AxiosError } from 'axios';

export const registerAttendee = async (payload: IRegisterAttendeePayload) => {
  try {
    const response = await Axios.post<ICommonResponseDTO<IRegistration>>(
      '/v1/registration',
      payload,
    );
    toast({
      title: 'Registration Confirmed! 🎉',
      description: `${payload.attendeeName} has been successfully registered.`,
    });
    return response.data.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      const { errorMessage } = ErrorHandler(err);
      toast({
        title: 'Registration Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    }
    throw err;
  }
};

export const cancelRegistration = async (id: string, payload?: ICancelRegistrationPayload) => {
  try {
    const response = await Axios.patch<
      ICommonResponseDTO<{ registration: IRegistration; nextWaitlisted?: unknown }>
    >(`/v1/registration/${id}/cancel`, payload ?? {});
    toast({
      title: 'Registration Cancelled',
      description: 'The seat has been freed and cancellation audit record preserved.',
    });
    return response.data.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      const { errorMessage } = ErrorHandler(err);
      toast({
        title: 'Cancellation Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    }
    throw err;
  }
};

export const fetchRegistrations = async (params?: IRegistrationQuery) => {
  try {
    const response = await Axios.get<
      ICommonResponseDTO<IPaginatedResponseDTO<IRegistration, IBasePaginationExtras>>
    >('/v1/registration', {
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

export const fetchWorkshopHistory = async (workshopId: string) => {
  try {
    const response = await Axios.get<
      ICommonResponseDTO<IPaginatedResponseDTO<IRegistration, IBasePaginationExtras>>
    >(`/v1/registration/workshop/${workshopId}`);
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

export const addAttendeeToWaitlist = async (payload: IRegisterAttendeePayload) => {
  try {
    const response = await Axios.post<ICommonResponseDTO<unknown>>(
      '/v1/registration/waitlist',
      payload,
    );
    toast({
      title: 'Added to Waitlist',
      description: `${payload.attendeeName} is now in queue for this workshop.`,
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
