import { Router } from 'express';
import * as commonController from '../controllers/common.controller';

const commonRoutes = Router();

commonRoutes.get('/', commonController.healthCheck);
commonRoutes.get('/health', commonController.healthCheck);
commonRoutes.all('*', commonController.fallback);

export default commonRoutes;
