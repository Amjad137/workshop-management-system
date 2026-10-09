import { auth } from '@/config/better-auth';
import { ERROR_MESSAGES } from '@/constants/error.constants';
import { SYSTEM_ROLE } from '@/constants/user.constants';
import ForbiddenException from '@/exceptions/forbidden.exception';
import UnauthorizedException from '@/exceptions/unauthorized.exception';
import { fromNodeHeaders } from 'better-auth/node';
import { NextFunction, Request, Response } from 'express';

export const validateUser = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers)
    });

    if (!session?.user || !session?.session) {
      throw new UnauthorizedException(ERROR_MESSAGES.UNAUTHORIZED);
    }

    req.user = session.user;
    req.session = session.session;

    return next();
  } catch (error) {
    return next(error);
  }
};

export const validateAdmin = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const user = req.user;

    if (!user || user.role !== SYSTEM_ROLE.ADMIN) {
      throw new ForbiddenException(ERROR_MESSAGES.ADMIN_ONLY_ACTION);
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

export const validateManager = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const user = req.user;

    if (!user || user.role !== SYSTEM_ROLE.MANAGER) {
      throw new ForbiddenException(ERROR_MESSAGES.MANAGER_ONLY_ACTION);
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

export const validateStaff = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const user = req.user;

    if (!user || user.role !== SYSTEM_ROLE.STAFF) {
      throw new ForbiddenException(ERROR_MESSAGES.FORBIDDEN);
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

export const validateManagerOrStaff = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const user = req.user;

    if (!user || (user.role !== SYSTEM_ROLE.MANAGER && user.role !== SYSTEM_ROLE.STAFF)) {
      if (user?.role === SYSTEM_ROLE.ADMIN) {
        throw new ForbiddenException(ERROR_MESSAGES.ADMIN_RESTRICTED_ACTION);
      }
      throw new ForbiddenException(ERROR_MESSAGES.STAFF_OR_MANAGER_ONLY_ACTION);
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

