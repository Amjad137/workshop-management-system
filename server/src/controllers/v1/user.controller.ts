import { auth } from '@/config/better-auth';
import { USER_ENTITY_STATUS } from '@/constants/db.constants';
import { ERROR_MESSAGES } from '@/constants/error.constants';
import { SYSTEM_ROLE } from '@/constants/user.constants';
import BadRequestException from '@/exceptions/bad-request.exception';
import NotFoundException from '@/exceptions/not-found.exception';
import UnauthorizedException from '@/exceptions/unauthorized.exception';
import userService from '@/services/user.service';
import { ICreateUserInput, IUserCountQuery, IUserEdit, IUserQuery } from '@/validators/user.validator';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

/*-----------Create User (Admin Only)--------------*/
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.getValid
      ? req.getValid<ICreateUserInput>('json')
      : (req.body as ICreateUserInput);

    const newUser = await auth.api.createUser({
      body: {
        email: payload.email,
        password: payload.password,
        name: payload.name,
        role: (payload.role as SYSTEM_ROLE) || SYSTEM_ROLE.STAFF,
        data: {
          phoneNumber: payload.phoneNumber || ''
        }
      }
    });

    return res.status(StatusCodes.CREATED).json({ user: newUser.user });
  } catch (error) {
    return next(error);
  }
};

/*-----------Get All Users--------------*/
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = req.getValid
      ? req.getValid<IUserQuery>('query')
      : (req.query as unknown as IUserQuery);
    const users = await userService.getAllUsers(query);
    return res.status(StatusCodes.OK).json(users);
  } catch (error) {
    return next(error);
  }
};

/*-----------Get All Active Users Count--------------*/
export const getUsersCount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { banned }: IUserCountQuery = req.getValid
      ? req.getValid<IUserCountQuery>('query')
      : (req.query as unknown as IUserCountQuery);
    const usersCount = await userService.countUsers(banned);
    return res.status(StatusCodes.OK).json(usersCount);
  } catch (error) {
    return next(error);
  }
};

/*-----------Get Single User by ID--------------*/
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const user = await userService.findUserById(id);
    return res.status(StatusCodes.OK).json({ user });
  } catch (error) {
    return next(error);
  }
};

/*-----------Update User by ID--------------*/
export const updateUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const payload: IUserEdit = req.getValid
      ? req.getValid<IUserEdit>('json')
      : (req.body as unknown as IUserEdit);

    if (!payload || Object.keys(payload).length === 0) {
      throw new BadRequestException(ERROR_MESSAGES.BAD_REQUEST);
    }

    const userProfile = await userService.findUserById(id);
    if (!userProfile) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    const authUser = req.user!;
    const isProfileOwner = userProfile.id === authUser.id;
    const isAdmin = authUser.role === SYSTEM_ROLE.ADMIN;

    if (!isProfileOwner && !isAdmin) {
      throw new UnauthorizedException(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const updatedUser = await userService.updateUserById(id, { $set: payload });
    return res.status(StatusCodes.OK).json({ user: updatedUser });
  } catch (error) {
    return next(error);
  }
};

/*-----------Delete User by ID--------------*/
export const deleteUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const user = req.user!;
    const foundUser = await userService.findUserById(id);

    if (!foundUser) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    const isProfileOwner = foundUser.id === user.id;
    const isAdmin = user.role === SYSTEM_ROLE.ADMIN;

    if (!isProfileOwner && !isAdmin) {
      throw new UnauthorizedException(ERROR_MESSAGES.UNAUTHORIZED);
    }

    await userService.updateUserById(id, {
      $set: { status: USER_ENTITY_STATUS.DELETED }
    });

    return res.status(StatusCodes.OK).json('Deleted the Profile Successfully');
  } catch (error) {
    return next(error);
  }
};
