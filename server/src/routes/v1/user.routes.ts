import * as userController from '@/controllers/v1/user.controller';
import { validateAdmin, validateUser } from '@/middleware/auth.middlewares';
import {
  createUserValidator,
  userCountQueryValidator,
  userEditValidator,
  userQueryValidator
} from '@/validators/user.validator';
import { Router } from 'express';

const userRoutes = Router();

/*-----------Create User (Admin Only)--------------*/
userRoutes.post(
  '/',
  validateUser,
  validateAdmin,
  createUserValidator,
  userController.createUser
);

/*-----------Get All Users--------------*/
userRoutes.get(
  '/',
  validateUser,
  validateAdmin,
  userQueryValidator,
  userController.getAllUsers
);

/*-----------Get All Active Users Count--------------*/
userRoutes.get(
  '/count',
  validateUser,
  validateAdmin,
  userCountQueryValidator,
  userController.getUsersCount
);

/*-----------Get Single User by ID--------------*/
userRoutes.get(
  '/:id',
  validateUser,
  userController.getUserById
);

/*-----------Update User by ID--------------*/
userRoutes.patch(
  '/:id',
  validateUser,
  userEditValidator,
  userController.updateUserById
);

/*-----------Delete User by ID--------------*/
userRoutes.delete(
  '/:id',
  validateUser,
  userController.deleteUserById
);

export default userRoutes;
