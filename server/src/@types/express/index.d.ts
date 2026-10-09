import { ISession, IUser } from '@/models/auth.models';

export type ValidationType = 'json' | 'query' | 'param' | 'header';

declare global {
  namespace Express {
    interface Request {
      rawBody?: Buffer;
      user?: IUser;
      session?: ISession;
      validatedData?: {
        json?: unknown;
        query?: unknown;
        param?: unknown;
        header?: unknown;
      };
      getValid?: <T = unknown>(type: ValidationType) => T;
    }
  }
}

export {};
