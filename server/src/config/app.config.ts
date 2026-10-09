import environment from '@/config/env.config';
import GlobalErrorHandler from '@/middleware/global-error-handler.middleware';
import SuccessResponseHandler from '@/middleware/success-response-handler.middleware';
import commonRoutes from '@/routes/common.routes';
import authRoutes from '@/routes/v1/auth.routes';
import routesV1 from '@/routes/v1';
import { httpLogger } from '@/utils/logger.utils';
import { printRoutes } from '@/utils/route.utils';
import rTracer from 'cls-rtracer';
import compression from 'compression';
import cors from 'cors';
import express, { json, urlencoded } from 'express';
import bearerToken from 'express-bearer-token';
import { queryParser } from 'express-query-parser';
import helmet from 'helmet';

const app = express();

// CORS configuration matching Hono
app.use(
  cors({
    origin: environment.clientUrl ? [environment.clientUrl] : true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'x-api-key'
    ],
    credentials: true,
    maxAge: 600
  })
);

app.use(helmet());
app.use(compression());
app.use(rTracer.expressMiddleware());

// Remove '/api' prefix if present so both /api/v1/... and /v1/... work seamlessly
app.use((req, res, next) => {
  if (req.url.startsWith('/api/')) {
    req.url = req.url.substring(4);
  }
  next();
});

// Better Auth MUST be mounted BEFORE express.json() so request body stream is not pre-consumed
app.use('/v1/auth', authRoutes);

// Body parsing middlewares for remaining routes
app.use(
  json({
    verify: (req, _res, buf: Buffer) => {
      req.rawBody = buf;
    }
  })
);

app.use(
  queryParser({
    parseNull: true,
    parseUndefined: true,
    parseBoolean: true,
    parseNumber: true
  })
);

app.use(urlencoded({ extended: false }));
app.use(bearerToken());

app.use(SuccessResponseHandler);
app.use(httpLogger);

// Mount application routes
app.use(routesV1);
app.use(commonRoutes);

// Print mounted routes to terminal
printRoutes(app);

// Global error handler
app.use(GlobalErrorHandler);

export default app;
