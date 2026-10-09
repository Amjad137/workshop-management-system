import * as invitationController from '@/controllers/v1/user-invitation.controller';
import { validateAdmin, validateUser } from '@/middleware/auth.middlewares';
import {
  createInvitationValidator,
  invitationQueryValidator
} from '@/validators/user-invitation.validator';
import { Router } from 'express';

const invitationRoutes = Router();

/*-----------Public Invitation Code Validation--------------*/
invitationRoutes.get('/validate/:code', invitationController.validateInvitationCode);

/*-----------Create Invitation (Admin Only)--------------*/
invitationRoutes.post(
  '/',
  validateUser,
  validateAdmin,
  createInvitationValidator,
  invitationController.createInvitation
);

/*-----------Get All Invitations (Admin Only)--------------*/
invitationRoutes.get(
  '/',
  validateUser,
  validateAdmin,
  invitationQueryValidator,
  invitationController.getAllInvitations
);

/*-----------Revoke Invitation (Admin Only)--------------*/
invitationRoutes.delete(
  '/:id',
  validateUser,
  validateAdmin,
  invitationController.revokeInvitation
);

export default invitationRoutes;
