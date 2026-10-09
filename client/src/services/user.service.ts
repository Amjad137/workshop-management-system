import { ISignupFormValues } from '@/components/saas/auth/sign-up/schema/sign-up.schema';
import Axios from '@/config/api.config';
import { COMMON_SORT, ENTITY_SORT } from '@/constants/common.constants';
import { IBasePaginationExtras, ICommonResponseDTO, IPaginatedResponseDTO } from '@/dto/common.dto';
import { IUserQuery } from '@/dto/user.dto';
import { toast } from '@/hooks/use-toast';
import { DeepPartial } from '@/types/common.type';
import { IUser } from '@/types/user.type';
import ErrorHandler from '@/utils/error-handler';
import { AxiosError } from 'axios';

export interface ICreateUserPayload {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
  role: string;
}

export const createUserAccount = async (payload: ICreateUserPayload) => {
  try {
    const response = await Axios.post<ICommonResponseDTO<{ user: IUser }>>('/v1/user', payload);
    toast({
      title: 'User Account Created',
      description: `Account for ${payload.name} (${payload.role}) created successfully.`,
    });
    return response.data.data?.user;
  } catch (err) {
    if (err instanceof AxiosError) {
      const { errorMessage } = ErrorHandler(err);
      toast({
        title: 'Error Creating User',
        description: errorMessage,
        variant: 'destructive',
      });
    }
    throw err;
  }
};

export const fetchAllUsers = async (params?: IUserQuery) => {
  try {
    const response = await Axios.get<
      ICommonResponseDTO<IPaginatedResponseDTO<IUser, IBasePaginationExtras>>
    >('/v1/user', {
      params: {
        ...params,
        sort_by: params?.sort_by ?? COMMON_SORT.DATE,
        limit: params?.limit ?? 24,
        skip: params?.skip ?? 0,
        sort_order: params?.sort_order ?? ENTITY_SORT.DESC,
      },
    });

    return response.data.data ?? [];
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

export const fetchAllUsersCount = async () => {
  try {
    const response = await Axios.get<ICommonResponseDTO<number>>('/v1/user/count');

    return response.data.data ?? 0;
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

export const fetchUserById = async (userId: string) => {
  try {
    const response = await Axios.get<ICommonResponseDTO<IUser>>(`/v1/user/${userId}`);

    return response.data.data || null;
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

export const updateUser = async (userId: string, data: DeepPartial<ISignupFormValues>) => {
  try {
    const response = await Axios.patch<ICommonResponseDTO<IUser>>(`/v1/user/${userId}`, {
      ...data,
    });

    return response.data.data || null;
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

export const updateUserByAdmin = async (
  userId: string,
  userData: Omit<ISignupFormValues, 'password' | 'confirmPassword' | 'entryCode'>,
) => {
  try {
    const response = await Axios.patch<ICommonResponseDTO<IUser>>(`/v1/user/${userId}/protected`, {
      updatedFields: {
        ...userData,
      },
    });

    return response.data.data || null;
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

export const updateMultipleUserStatus = async (userIDs: string[], status: boolean) => {
  try {
    const response = await Axios.patch<
      ICommonResponseDTO<{ message: string; updatedProfileIDs: string[] }>
    >('/v1/user/status', {
      userIDs,
      status,
    });

    return response.data.data ?? null;
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

export const verifyMultipleUsers = async (userIDs: string[], verification: string) => {
  try {
    const response = await Axios.patch<
      ICommonResponseDTO<{ message: string; verifiedProfileIDs: string[] }>
    >('/v1/user/verify', {
      userIDs,
      verification: verification === 'true',
    });

    return response.data.data ?? null;
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

export const deleteUserById = async (userId: string) => {
  try {
    const response = await Axios.delete<ICommonResponseDTO<null>>(`/v1/user/${userId}`);

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
