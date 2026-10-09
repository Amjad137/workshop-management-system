import { createAccessControl } from 'better-auth/plugins/access';
import { defaultStatements } from 'better-auth/plugins/organization/access';

const statement = {
  ...defaultStatements,
  orders: ['create', 'update', 'delete'],
  quotations: ['create', 'update', 'delete'],
  products: ['create', 'update', 'delete']
} as const;

export const ac = createAccessControl(statement);

export const adminRole = ac.newRole({
  orders: ['create', 'update', 'delete'],
  quotations: ['create', 'update', 'delete'],
  products: ['create', 'update', 'delete']
});

export const managerRole = ac.newRole({
  orders: ['create', 'update', 'delete'],
  quotations: ['create', 'update', 'delete'],
  products: ['create', 'update', 'delete']
});

export const staffRole = ac.newRole({
  orders: ['create', 'update', 'delete'],
  quotations: ['create', 'update', 'delete'],
  products: ['create', 'update', 'delete']
});

export const owner = adminRole;
export const manager = managerRole;
export const staff = staffRole;

