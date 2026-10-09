import { ERROR_MESSAGES } from '@/constants/error.constants';
import { AxiosError } from 'axios';
import codes from 'http-status-codes';

type ErrorResponse = {
  error?: boolean | string;
  message?: string;
  data?: {
    message?: string;
    code?: string;
  };
};

const extractServerMessage = (data: unknown): string | undefined => {
  if (!data) return undefined;
  if (typeof data === 'string') {
    // Avoid returning raw HTML error pages
    if (data.trim().startsWith('<')) return undefined;
    return data;
  }
  if (typeof data === 'object') {
    const obj = data as Record<string, any>;
    if (typeof obj.message === 'string' && obj.message.trim()) {
      return obj.message;
    }
    if (typeof obj.data?.message === 'string' && obj.data.message.trim()) {
      return obj.data.message;
    }
    if (typeof obj.error === 'string' && obj.error.trim()) {
      return obj.error;
    }
  }
  return undefined;
};

const ErrorHandler = (error: AxiosError<ErrorResponse>) => {
  let errorMessage = '';

  const serverMessage = extractServerMessage(error.response?.data);

  if (serverMessage) {
    return { errorMessage: serverMessage };
  }

  switch (error.response?.status) {
    case codes.BAD_REQUEST:
      errorMessage = ERROR_MESSAGES.BAD_REQUEST;
      break;
    case codes.CONFLICT:
      errorMessage = ERROR_MESSAGES.CONFLICT;
      break;
    case codes.UNAUTHORIZED:
      errorMessage = ERROR_MESSAGES.UNAUTHORIZED;
      break;
    case codes.NOT_FOUND:
      errorMessage = ERROR_MESSAGES.NOT_FOUND;
      break;
    case codes.INTERNAL_SERVER_ERROR:
      errorMessage = ERROR_MESSAGES.INTERNAL_SERVER_ERR;
      break;
    default:
      errorMessage = error.message || ERROR_MESSAGES.UNKNOWN_ERR;
      break;
  }

  return { errorMessage };
};

export default ErrorHandler;

export interface ApiErrorResponse {
  error?: boolean | string;
  message?: string;
  data?: {
    message?: string;
    code?: string;
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
  if (!error) return 'An unexpected error occurred';

  // Better Auth error shape: { error: true, data: { message, code }, message: statusText }
  if (typeof error === 'object' && 'error' in error && error !== null) {
    const betterAuthError = error as BetterAuthError;
    return (
      betterAuthError.data?.message || betterAuthError.message || 'An unexpected error occurred'
    );
  }

  if (error instanceof AxiosError) {
    const serverMessage = extractServerMessage(error.response?.data);
    if (serverMessage) return serverMessage;
    return error.message || 'An unexpected error occurred';
  }

  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export const isApiError = (error: unknown): error is AxiosError => {
  return error instanceof AxiosError;
};

