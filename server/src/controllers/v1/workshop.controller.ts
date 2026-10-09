import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { workshopService } from '@/services/workshop.service';
import {
  ICreateWorkshopInput,
  IUpdateWorkshopInput,
  IWorkshopQueryInput
} from '@/validators/workshop.validator';
import { IUser } from '@/models/auth.models';

export const createWorkshop = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.getValid
      ? req.getValid<ICreateWorkshopInput>('json')
      : (req.body as ICreateWorkshopInput);

    const workshop = await workshopService.createWorkshop(payload, req.user as IUser);
    return res.status(StatusCodes.CREATED).json(workshop);
  } catch (error) {
    return next(error);
  }
};

export const updateWorkshop = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const payload = req.getValid
      ? req.getValid<IUpdateWorkshopInput>('json')
      : (req.body as IUpdateWorkshopInput);

    const workshop = await workshopService.updateWorkshop(id, payload, req.user as IUser);
    return res.status(StatusCodes.OK).json(workshop);
  } catch (error) {
    return next(error);
  }
};

export const getWorkshopById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const workshop = await workshopService.getWorkshopById(id);
    return res.status(StatusCodes.OK).json(workshop);
  } catch (error) {
    return next(error);
  }
};

export const getAllWorkshops = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = req.getValid
      ? req.getValid<IWorkshopQueryInput>('query')
      : (req.query as unknown as IWorkshopQueryInput);

    const result = await workshopService.listWorkshops(query);
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    return next(error);
  }
};
