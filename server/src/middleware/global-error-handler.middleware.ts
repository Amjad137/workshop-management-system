/* eslint-disable @typescript-eslint/no-unused-vars */
import { type NextFunction, type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import ApplicationException from '../exceptions/application.exception';

const GlobalErrorHandler = (
  error: ApplicationException,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.log('globalErrorHandler', error);

  return res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
    error: true,
    message: error.message || 'Internal Server Error',
  });
};

export default GlobalErrorHandler;
