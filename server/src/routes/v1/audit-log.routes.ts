import * as auditLogController from '@/controllers/v1/audit-log.controller';
import { validateAdmin, validateUser } from '@/middleware/auth.middlewares';
import { auditLogQueryValidator } from '@/validators/audit-log.validator';
import { Router } from 'express';

const auditLogRoutes = Router();

/*-----------Get All Audit Logs--------------*/
auditLogRoutes.get(
  '/',
  validateUser,
  validateAdmin,
  auditLogQueryValidator,
  auditLogController.getAllAuditLogs
);

/*-----------Get Single Audit Log by ID--------------*/
auditLogRoutes.get(
  '/:id',
  validateUser,
  validateAdmin,
  auditLogController.getAuditLogById
);

/*-----------Get Audit Logs by Entity--------------*/
auditLogRoutes.get(
  '/entity/:entityId',
  validateUser,
  validateAdmin,
  auditLogController.getAuditLogsByEntity
);

export default auditLogRoutes;
