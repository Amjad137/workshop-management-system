import { createAuthClient } from 'better-auth/react';
import {
  adminClient,
  inferAdditionalFields,
  organizationClient,
  usernameClient,
} from 'better-auth/client/plugins';

import { environment } from '@/config/env.config';

export const authClient = createAuthClient({
  baseURL: environment.apiURL,
  basePath: '/v1/auth',
  plugins: [
    inferAdditionalFields({
      user: {
        phoneNumber: { type: 'string', required: true },
        address: { type: 'string', required: true },
        role: { type: 'string', required: false },
      },
    }),
    adminClient(),
    usernameClient(),
    organizationClient(),
  ],
});
