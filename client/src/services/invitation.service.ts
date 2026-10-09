import Axios from '@/config/api.config';
import { IBasePaginationExtras, ICommonResponseDTO, IPaginatedResponseDTO } from '@/dto/common.dto';
import { toast } from '@/hooks/use-toast';
import {
  ICreateInvitationPayload,
  IInvitationQuery,
  IUserInvitation,
  IValidatedInvitation,
} from '@/types/invitation.type';
import ErrorHandler from '@/utils/error-handler';
import { AxiosError } from 'axios';

export const fetchAllInvitations = async (params?: IInvitationQuery) => {
  try {
    const response = await Axios.get<
      ICommonResponseDTO<IPaginatedResponseDTO<IUserInvitation, IBasePaginationExtras>>
    >('/v1/invitations', {
      params: {
        ...params,
        sort_by: params?.sort_by ?? 'createdAt',
        limit: params?.limit ?? 20,
        skip: params?.skip ?? 0,
        sort_order: params?.sort_order ?? 'desc',
      },
    });

    return response.data.data ?? { results: [], extras: { total: 0, limit: 20, skip: 0 } };
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

export const createInvitation = async (payload: ICreateInvitationPayload) => {
  try {
    const response = await Axios.post<ICommonResponseDTO<IUserInvitation>>(
      '/v1/invitations',
      payload,
    );
    toast({
      title: 'Invitation Sent! ✉️',
      description: `Staff invite sent to ${payload.email} (${payload.role}).`,
    });
    return response.data.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      const { errorMessage } = ErrorHandler(err);
      toast({
        title: 'Failed to Send Invitation',
        description: errorMessage,
        variant: 'destructive',
      });
    }
    throw err;
  }
};

export const revokeInvitation = async (id: string) => {
  try {
    const response = await Axios.delete<ICommonResponseDTO<{ message: string }>>(
      `/v1/invitations/${id}`,
    );
    toast({
      title: 'Invitation Revoked',
      description: 'The invitation code has been successfully cancelled.',
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

export const validateInvitationCode = async (code: string): Promise<IValidatedInvitation> => {
  try {
    const response = await Axios.get<ICommonResponseDTO<IValidatedInvitation>>(
      `/v1/invitations/validate/${encodeURIComponent(code)}`,
    );
    if (!response.data.data) {
      throw new Error('Invalid or expired invitation code.');
    }
    return response.data.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      const { errorMessage } = ErrorHandler(err);
      throw new Error(errorMessage || 'Invalid or expired invitation code.');
    }
    throw err;
  }
};
