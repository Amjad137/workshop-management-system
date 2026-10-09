# Express MongoDB Boilerplate

A production-ready, opinionated Express.js + TypeScript backend boilerplate with **Better Auth**, MongoDB (dual Mongoose & Native driver repository pattern), AWS S3 file storage, Yup validation with payload sanitization, and structured error handling.

---

## Tech Stack

- **Runtime**: Node.js (>=20, native ESM with `"type": "module"`)
- **Language**: TypeScript (strict types, zero `any`)
- **Bundler & Build Tool**: [tsup](https://tsup.egoist.dev/) (esbuild-powered ESM bundler)
- **Web Framework**: Express.js
- **Authentication**: [Better Auth](https://www.better-auth.com/) with native MongoDB adapter
  - Role-based Access Control (RBAC: `owner`, `manager`, `staff`, `admin`, `super-admin`)
  - Organization plugin, username plugin, session & admin management
- **Database & Data Access**:
  - **Mongoose**: Application schemas & models (`AuditLog`, etc.)
  - **Native MongoDB Driver**: High-performance Better Auth collection querying
  - **Dual Repository Pattern**: Generic `BaseRepository<T, M>` (Mongoose) + `AuthRepository<T>` (Native Driver)
- **Validation**: [Yup](https://github.com/jquense/yup) schemas with recursive empty-value sanitization (`req.getValid<T>()`)
- **File Storage**: AWS S3 SDK v3 (`@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`) for presigned uploads and URL generation
- **Logging & Tracing**: Winston, `express-winston`, and `cls-rtracer` (unique request ID correlation)
- **Security & Headers**: Helmet, CORS, Compression, Bearer token extraction

---

## Architecture

The project follows a strict 4-tier layered architecture:

```
HTTP Request
     │
     ▼
┌──────────────┐
│    Routes    │  -> Path definitions, HTTP verbs, middleware pipelines (auth, Yup validation)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Controllers  │  -> Request extraction (req.getValid, req.params), HTTP status codes, JSON responses
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Services   │  -> Domain & business orchestration (pure logic, no HTTP dependencies)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Repositories │  -> Database queries, facet pagination, projection, populate chains
└──────┬───────┘
       │
       ▼
  MongoDB Database
```

### Dual Repository Pattern

1. **`BaseRepository<T, Model>`** (`src/Repositories/base.repository.ts`):
   - Generic data access layer extending Mongoose models.
   - Automatically excludes schema-hidden fields (e.g. `isDeleted`, `__v`).
   - Built-in `$facet` aggregation pagination (`paginate()`).
   - Dynamic chaining for sorting and field population (`findByIdAndPopulate()`).

2. **`AuthRepository<T>`** (`src/Repositories/auth.repository.ts`):
   - Direct access to native MongoDB collections (`users`, `sessions`, `organizations`, `members`, `invitations`) managed by Better Auth.
   - Extensible for domain-specific user queries (`user.repository.ts`).

---

## Authentication (Better Auth)

Authentication is handled by **Better Auth** mounted directly before body parsing middlewares so raw request streams are preserved:

- **Auth Endpoints**: Mounted at `/v1/auth/*` (e.g., `/v1/auth/sign-in/email`, `/v1/auth/sign-up/email`, `/v1/auth/session`, `/v1/auth/organization/*`).
- **Session Validation**: Middleware `validateUser` verifies session cookies/headers using `fromNodeHeaders(req.headers)`.
- **Role Guards**: `validateAdmin`, `validateSuperAdmin`, and `validateAdminOrSuperAdmin` guard protected routes.

---

## Request Validation & Sanitization

Validation is handled by Yup schemas via `src/middleware/yup-validator.middleware.ts`:

- Automatically removes empty strings, empty arrays, and undefined keys recursively (`cleanEmptyValues`).
- Updates `req.body`, `req.query`, and `req.params` with cleaned, validated data.
- Provides a strictly-typed getter: `req.getValid<T>('query' | 'json' | 'params')`.

---

## Project Structure

```
src/
├── @types/                 # Express Request augmentation & type declarations
├── config/
│   ├── app.config.ts       # Express app setup, CORS, security, middleware pipelines
│   ├── db.config.ts        # Mongoose connection & native MongoDB client/db accessors
│   ├── env.config.ts       # Environment variable validation & centralized configs
│   ├── s3.config.ts        # AWS S3 client configuration
│   └── better-auth/        # Better Auth instance, MongoDB adapter, & permissions
├── constants/              # Global constants (DB, user roles, errors, audit-logs)
├── controllers/v1/         # Route controllers (user, audit-log, s3, common)
├── dto/                    # Data Transfer Objects & pagination contracts
├── exceptions/             # Standard HTTP exception classes (400, 401, 403, 404, etc.)
├── middleware/             # Middlewares (auth, yup validator, error handlers)
├── models/                 # Mongoose schemas/models & Better Auth types
├── Repositories/           # Data access layer (base, auth, user, audit-log)
├── routes/
│   ├── v1/                 # API v1 routes (auth, user, audit-log, s3)
│   └── common.routes.ts    # Health check & fallback routes
├── services/               # Domain services (user, audit-log)
├── utils/                  # Utilities (s3 presigned URLs, logger, route printer)
├── validators/             # Yup validation schemas (user, audit-log, s3)
└── server.ts               # Server bootstrap: connects MongoDB, loads app, listens
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or higher)
- [MongoDB](https://www.mongodb.com/) (v6 or higher, replica set recommended for transactions)
- [Yarn](https://classic.yarnpkg.com/)

### 1. Installation

```bash
yarn install
```

### 2. Environment Configuration

Copy the example environment file and update with your credentials:

```bash
cp .env.example .env.local
```

Key environment variables:
```env
PORT=8000
MONGODB_URI=mongodb://localhost:27017/express-boilerplate
API_URL=http://localhost:8000
CLIENT_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-secure-random-32-char-secret

# AWS S3 (Optional for uploads)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
S3_BUCKET_NAME=your-s3-bucket-name
```

### 3. Development Server

Start the local development server in watch mode:

```bash
yarn start:local
```

The application will:
1. Connect to MongoDB.
2. Dynamically initialize the Express server.
3. Automatically log all mounted routes to the terminal.
4. Listen on `http://localhost:8000`.

---

## Available Scripts

| Command | Description |
| :--- | :--- |
| `yarn start:local` | Copies `.env.local` to `.env` and runs `tsup` in watch mode |
| `yarn build` | Builds the optimized production ESM bundle to `/dist` |
| `yarn build:check` | Type-checks the entire project with `tsc --noEmit` |
| `yarn start` | Runs the compiled production server (`node ./dist/server.js`) |
| `yarn lint` | Lints codebase using ESLint and SonarJS |
| `yarn format` | Checks code formatting with Prettier |
| `yarn format:fix` | Automatically formats files using Prettier |

---

## Health Check & API Endpoints

- **Health Check**: `GET /health` or `GET /`
- **Authentication**: `ALL /v1/auth/*`
- **Users**:
  - `GET /v1/user` - Paginated user list (Admin/SuperAdmin)
  - `GET /v1/user/count` - Active/banned user counts (Admin/SuperAdmin)
  - `GET /v1/user/:id` - Fetch user profile
  - `PATCH /v1/user/:id` - Update user profile (Owner or Admin)
  - `DELETE /v1/user/:id` - Soft-delete user profile (Owner or Admin)
- **Audit Logs**:
  - `GET /v1/audit-log` - Paginated audit logs (SuperAdmin)
  - `GET /v1/audit-log/:id` - Fetch single audit log (SuperAdmin)
  - `GET /v1/audit-log/entity/:entityId` - Audit history for a specific entity (SuperAdmin)
- **S3 Storage**:
  - `POST /v1/s3/protected-upload` - Generate presigned URLs for documents & private files
  - `POST /v1/s3/public-upload` - Generate presigned URLs for public images
  - `GET /v1/s3/file-url/:key` - Fetch public or secure signed access URL
  - `DELETE /v1/s3/files` - Batch delete files from S3 bucket
