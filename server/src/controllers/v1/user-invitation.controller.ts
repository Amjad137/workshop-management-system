import userInvitationService from '@/services/user-invitation.service';
import {
  ICreateInvitationInput,
  IInvitationQuery
} from '@/validators/user-invitation.validator';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

/*-----------Create User Invitation (Admin Only)--------------*/
export const createInvitation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.getValid
      ? req.getValid<ICreateInvitationInput>('json')
      : (req.body as ICreateInvitationInput);

    const invitation = await userInvitationService.createInvitation(payload, req.user!);
    return res.status(StatusCodes.CREATED).json(invitation);
  } catch (error) {
    return next(error);
  }
};

/*-----------Get All Invitations (Admin Only)--------------*/
export const getAllInvitations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = req.getValid
      ? req.getValid<IInvitationQuery>('query')
      : (req.query as unknown as IInvitationQuery);

    const result = await userInvitationService.getAllInvitations(query);
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    return next(error);
  }
};

/*-----------Revoke Invitation (Admin Only)--------------*/
export const revokeInvitation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    await userInvitationService.revokeInvitation(id);
    return res.status(StatusCodes.OK).json({ message: 'Invitation revoked successfully.' });
  } catch (error) {
    return next(error);
  }
};

/*-----------Validate Invitation Code (Public)--------------*/
export const validateInvitationCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const code = req.params.code;
    const result = await userInvitationService.validateInvitationCode(code);
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    return next(error);
  }
};
