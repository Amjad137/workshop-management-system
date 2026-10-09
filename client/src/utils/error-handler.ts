import { ERROR_MESSAGES } from '@/constants/error.constants';
import { AxiosError } from 'axios';
import codes from 'http-status-codes';

type ErrorResponse = {
  data: {
    message: string;
  };
};

const ErrorHandler = (error: AxiosError<ErrorResponse>) => {
  let errorMessage = '';

  switch (error.response?.status) {
    case codes.BAD_REQUEST:
      errorMessage = error.response?.data?.data?.message ?? ERROR_MESSAGES.BAD_REQUEST;
      break;
    case codes.CONFLICT:
      errorMessage = error.response?.data?.data?.message ?? ERROR_MESSAGES.CONFLICT;
      break;
    case codes.UNAUTHORIZED:
      errorMessage = error.response?.data?.data?.message ?? ERROR_MESSAGES.UNAUTHORIZED;
      break;
    case codes.NOT_FOUND:
      errorMessage = error.response?.data?.data?.message ?? ERROR_MESSAGES.NOT_FOUND;
      break;
    case codes.INTERNAL_SERVER_ERROR:
      errorMessage = error.response?.data?.data?.message ?? ERROR_MESSAGES.INTERNAL_SERVER_ERR;
      break;
    default:
      errorMessage = error.response?.data?.data?.message ?? ERROR_MESSAGES.UNKNOWN_ERR;
      break;
  }

  return { errorMessage };
};

export default ErrorHandler;

export interface ApiErrorResponse {
  message?: string;
  data?: {
    message?: string;
  };
}

type BetterAuthError = {
  error?: boolean;
  data?: { message?: string; code?: string };
  status?: number;
  statusText?: string;
  message?: string;
};

export const getErrorMessage = (error: unknown): string => {
  // Better Auth error shape: { error: true, data: { message, code }, message: statusText }
  if (typeof error === 'object' && error !== null && 'error' in error) {
    const betterAuthError = error as BetterAuthError;
    return (
      betterAuthError.data?.message || betterAuthError.message || 'An unexpected error occurred'
    );
  }

  if (error instanceof AxiosError) {
    const response = error.response?.data as ApiErrorResponse;
    return (
      response?.message ||
      response?.data?.message ||
      error.message ||
      'An unexpected error occurred'
    );
  }

  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export const isApiError = (error: unknown): error is AxiosError => {
  return error instanceof AxiosError;
};
