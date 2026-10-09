import { StatusCodes } from 'http-status-codes';

import { ERROR_MESSAGES } from '../constants/error.constants';
import ApplicationException from './application.exception';

export default class ConflictException extends ApplicationException {
  constructor(message = ERROR_MESSAGES.CONFLICT) {
    super(message, StatusCodes.CONFLICT);
  }
}
