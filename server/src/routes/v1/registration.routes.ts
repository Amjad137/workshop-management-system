import * as registrationController from '@/controllers/v1/registration.controller';
import { validateManagerOrStaff, validateUser } from '@/middleware/auth.middlewares';
import {
  cancelRegistrationValidator,
  registerAttendeeValidator,
  registrationQueryValidator
} from '@/validators/registration.validator';
import { Router } from 'express';

const registrationRoutes = Router();

/*-----------Register Attendee (Manager & Staff Only)--------------*/
registrationRoutes.post(
  '/',
  validateUser,
  validateManagerOrStaff,
  registerAttendeeValidator,
  registrationController.registerAttendee
);

/*-----------Cancel Registration (Manager & Staff Only)--------------*/
registrationRoutes.patch(
  '/:id/cancel',
  validateUser,
  validateManagerOrStaff,
  cancelRegistrationValidator,
  registrationController.cancelRegistration
);

/*-----------Get All Registrations (Manager & Staff Only)--------------*/
registrationRoutes.get(
  '/',
  validateUser,
  validateManagerOrStaff,
  registrationQueryValidator,
  registrationController.getAllRegistrations
);

/*-----------Get Workshop Registration History (Manager & Staff Only)--------------*/
registrationRoutes.get(
  '/workshop/:id',
  validateUser,
  validateManagerOrStaff,
  registrationController.getHistoryByWorkshopId
);

/*-----------Add Attendee to Waitlist (Bonus)--------------*/
registrationRoutes.post(
  '/waitlist',
  validateUser,
  validateManagerOrStaff,
  registerAttendeeValidator,
  registrationController.addToWaitlist
);

/*-----------Get Workshop Waitlist (Bonus)--------------*/
registrationRoutes.get(
  '/waitlist/:id',
  validateUser,
  validateManagerOrStaff,
  registrationController.getWaitlistByWorkshopId
);

export default registrationRoutes;
