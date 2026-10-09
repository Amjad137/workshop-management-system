import { AUDIT_ACTION, AUDIT_ENTITY_TYPE, AUDIT_STATUS } from '@/constants/audit-log.constants';
import pkg from 'lodash';
import { date, mixed, object, string } from 'yup';
import { paginationQuerySchema } from '../common.schema';

/**
 * Audit log query schema
 * Extends the common pagination schema with audit log-specific filters
 */
export const auditLogQuerySchema = paginationQuerySchema.concat(
  object({
    entityType: mixed<AUDIT_ENTITY_TYPE>().oneOf(pkg.values(AUDIT_ENTITY_TYPE)).optional(),
    action: mixed<AUDIT_ACTION>().oneOf(pkg.values(AUDIT_ACTION)).optional(),
    status: mixed<AUDIT_STATUS>().oneOf(pkg.values(AUDIT_STATUS)).optional(),
    actorId: string().optional(),
    entityId: string().optional(),
    dateFrom: date().optional(),
    dateTo: date().optional()
  })
);
