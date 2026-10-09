import { Calendar, LayoutDashboard, Mail, Ticket, Users } from 'lucide-react';
import { ROUTES } from './routes.constants';

export const SIDEBAR_MENU_CATEGORIES = {
  HOME: 'Home',
  USERS_MANAGEMENT: 'Staff & Accounts',
  WORKSHOPS_MANAGEMENT: 'Workshops & Bookings',
};

export const COMMON_SIDEBAR_MENU_ITEMS = {
  HOME: [
    {
      name: 'Overview',
      url: ROUTES.SAAS_ROOT,
      icon: LayoutDashboard,
    },
  ],
  WORKSHOPS: [
    {
      name: 'Workshops Catalogue',
      url: ROUTES.WORKSHOPS_ROOT,
      icon: Calendar,
    },
    {
      name: 'Registrations & History',
      url: ROUTES.REGISTRATIONS_ROOT,
      icon: Ticket,
    },
  ],
  USERS: [
    {
      name: 'Staff Accounts',
      url: ROUTES.USERS_ROOT,
      icon: Users,
    },
    {
      name: 'Staff Invitations',
      url: ROUTES.INVITATIONS_ROOT,
      icon: Mail,
    },
  ],
};
