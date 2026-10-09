import { ENTITY_SORT } from '@/constants/db.constants';
import { ERROR_MESSAGES } from '@/constants/error.constants';
import BadRequestException from '@/exceptions/bad-request.exception';
import auditLogService from '@/services/audit-log.service';
import { IAuditLogQuery } from '@/validators/audit-log.validator';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { isValidObjectId } from 'mongoose';

export const getAllAuditLogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = req.getValid
      ? req.getValid<IAuditLogQuery>('query')
      : (req.query as unknown as IAuditLogQuery);
    const auditLogs = await auditLogService.getAllAuditLogs(query);
    return res.status(StatusCodes.OK).json(auditLogs);
  } catch (error) {
    return next(error);
  }
};

export const getAuditLogById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const auditLog = await auditLogService.findById(id);
    return res.status(StatusCodes.OK).json({ auditLog });
  } catch (error) {
    return next(error);
  }
};

export const getAuditLogsByEntity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const entityId = req.params.entityId;

    if (!isValidObjectId(entityId)) {
      throw new BadRequestException(ERROR_MESSAGES.INVALID_OBJECT_ID);
    }

    const auditLogs = await auditLogService.findByIdAndPopulate(
      entityId,
      { sort_by: 'timestamp', sort_order: ENTITY_SORT.DESC },
      [{ path: 'actorId', select: 'firstName lastName surname authUserId' }]
    );

    return res.status(StatusCodes.OK).json(auditLogs);
  } catch (error) {
    return next(error);
  }
};
