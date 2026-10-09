import { Router } from 'express';
import auditLogRoutes from './audit-log.routes';
import s3Routes from './s3.routes';
import userRoutes from './user.routes';
import workshopRoutes from './workshop.routes';
import registrationRoutes from './registration.routes';

const routesV1 = Router();

routesV1.use('/v1/user', userRoutes);
routesV1.use('/v1/workshop', workshopRoutes);
routesV1.use('/v1/registration', registrationRoutes);
routesV1.use('/v1/audit-log', auditLogRoutes);
routesV1.use('/v1/s3', s3Routes);

export default routesV1;
