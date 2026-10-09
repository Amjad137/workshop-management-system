import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { registrationService } from '@/services/registration.service';
import {
  ICancelRegistrationInput,
  IRegisterAttendeeInput,
  IRegistrationQueryInput
} from '@/validators/registration.validator';
import { IUser } from '@/models/auth.models';

export const registerAttendee = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.getValid
      ? req.getValid<IRegisterAttendeeInput>('json')
      : (req.body as IRegisterAttendeeInput);

    const registration = await registrationService.registerAttendee(payload, req.user as IUser);
    return res.status(StatusCodes.CREATED).json(registration);
  } catch (error) {
    return next(error);
  }
};

export const cancelRegistration = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const payload = req.getValid
      ? req.getValid<ICancelRegistrationInput>('json')
      : (req.body as ICancelRegistrationInput);

    const result = await registrationService.cancelRegistration(
      id,
      payload?.cancellationReason,
      req.user as IUser
    );
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    return next(error);
  }
};

export const getAllRegistrations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = req.getValid
      ? req.getValid<IRegistrationQueryInput>('query')
      : (req.query as unknown as IRegistrationQueryInput);

    const result = await registrationService.listRegistrations(query);
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    return next(error);
  }
};

export const getHistoryByWorkshopId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await registrationService.getHistoryByWorkshopId(id);
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    return next(error);
  }
};

export const addToWaitlist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.getValid
      ? req.getValid<IRegisterAttendeeInput>('json')
      : (req.body as IRegisterAttendeeInput);

    const waitlisted = await registrationService.addToWaitlist(payload, req.user as IUser);
    return res.status(StatusCodes.CREATED).json(waitlisted);
  } catch (error) {
    return next(error);
  }
};

export const getWaitlistByWorkshopId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const waitlist = await registrationService.getWaitlistByWorkshopId(id);
    return res.status(StatusCodes.OK).json(waitlist);
  } catch (error) {
    return next(error);
  }
};

export const getAllWaitlists = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { workshopId, search_key, limit, skip } = req.query;
    const result = await registrationService.getAllWaitlists({
      workshopId: workshopId as string | undefined,
      search_key: search_key as string | undefined,
      limit: limit ? Number(limit) : undefined,
      skip: skip ? Number(skip) : undefined
    });
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    return next(error);
  }
};

export const removeFromWaitlist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await registrationService.removeFromWaitlist(id);
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    return next(error);
  }
};

export const promoteFromWaitlist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await registrationService.promoteFromWaitlist(id, req.user as IUser);
    return res.status(StatusCodes.CREATED).json(result);
  } catch (error) {
    return next(error);
  }
};

