import * as workshopController from '@/controllers/v1/workshop.controller';
import { validateManager, validateManagerOrStaff, validateUser } from '@/middleware/auth.middlewares';
import {
  createWorkshopValidator,
  updateWorkshopValidator,
  workshopQueryValidator
} from '@/validators/workshop.validator';
import { Router } from 'express';

const workshopRoutes = Router();

/*-----------Create Workshop (Manager Only)--------------*/
workshopRoutes.post(
  '/',
  validateUser,
  validateManager,
  createWorkshopValidator,
  workshopController.createWorkshop
);

/*-----------Update Workshop (Manager Only)--------------*/
workshopRoutes.patch(
  '/:id',
  validateUser,
  validateManager,
  updateWorkshopValidator,
  workshopController.updateWorkshop
);

/*-----------Get All Workshops (Manager & Staff Only)--------------*/
workshopRoutes.get(
  '/',
  validateUser,
  validateManagerOrStaff,
  workshopQueryValidator,
  workshopController.getAllWorkshops
);

/*-----------Get Workshop By ID (Manager & Staff Only)--------------*/
workshopRoutes.get(
  '/:id',
  validateUser,
  validateManagerOrStaff,
  workshopController.getWorkshopById
);

export default workshopRoutes;
