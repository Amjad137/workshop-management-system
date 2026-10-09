// Mock Better Auth instance for tests
jest.mock('@/config/better-auth', () => ({
  __esModule: true,
  auth: {
    handler: jest.fn(),
    api: {
      getSession: jest.fn().mockResolvedValue(null),
    },
  },
}));

// Mock Better Auth node adapter
jest.mock('better-auth/node', () => ({
  toNodeHandler: jest.fn(() => (_req: unknown, res: { end: () => void }, next?: () => void) => {
    if (next) return next();
    res.end();
  }),
  fromNodeHeaders: jest.fn(() => new Headers()),
}));

// Mock DB connection for tests
jest.mock('@/config/db.config', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue(true),
  connect: jest.fn().mockResolvedValue(true),
  disconnect: jest.fn().mockResolvedValue(undefined),
  getMongoClient: jest.fn().mockReturnValue({}),
  getMongoDb: jest.fn().mockReturnValue({}),
}));
