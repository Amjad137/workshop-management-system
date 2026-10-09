import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import environment from '../config/env.config';
import { ERROR_MESSAGES } from '../constants/error.constants';
import { HealthCheckResponseDTO } from '../dto/common.dto';
import NotFoundException from '../exceptions/not-found.exception';

export const healthCheck = async (req: Request, res: Response) => {
  const responseBody: HealthCheckResponseDTO = {
    name: environment.packageName,
    version: environment.packageVersion,
    env: environment.env,
  };

  res.status(StatusCodes.OK).json(responseBody);
};

export const fallback = (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundException(ERROR_MESSAGES.ROUTE_NOT_FOUND));
};
