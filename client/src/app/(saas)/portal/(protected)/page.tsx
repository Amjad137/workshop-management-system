'use client';

import AdminDashboard from '@/components/saas/dashboards/admin/admin-dashboard';
import StaffDashboard from '@/components/saas/dashboards/staff/staff-dashboard';
import { USER_ROLE } from '@/constants/user.constants';
import { useAuthStore } from '@/stores/auth.store';

const Home = () => {
  const { userRole } = useAuthStore();

  if (userRole === USER_ROLE.ADMIN) {
    return <AdminDashboard />;
  }

  return <StaffDashboard />;
};

export default Home;
