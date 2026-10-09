import { StatusCodes } from 'http-status-codes';
import { ERROR_MESSAGES } from '../constants/error.constants';

export default class ApplicationException extends Error {
  status = StatusCodes.INTERNAL_SERVER_ERROR;

  constructor(message: string, status: number) {
    super();

    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;

    this.message = message ?? ERROR_MESSAGES.INTERNAL_SERVER_ERR;

    this.status = status;
  }
}
