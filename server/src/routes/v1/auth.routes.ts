import { auth } from '@/config/better-auth';
import { toNodeHandler } from 'better-auth/node';
import { Router } from 'express';

const authRoutes = Router();

authRoutes.all('/*', toNodeHandler(auth));

export default authRoutes;
