import { StatusCodes } from 'http-status-codes';

import { ERROR_MESSAGES } from '../constants/error.constants';
import ApplicationException from './application.exception';

export default class TooManyRequestsException extends ApplicationException {
  constructor(message = ERROR_MESSAGES.TOO_MANY_REQUESTS) {
    super(message, StatusCodes.TOO_MANY_REQUESTS);
  }
}
