'use client';

import { SiteHeader } from '@/components/saas/shared/header';
import { AdminSidebar } from '@/components/saas/sidebar/admin/admin-sidebar';
import { UserSidebar } from '@/components/saas/sidebar/user/user-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { USER_ROLE } from '@/constants/user.constants';
import ReactQueryProvider from '@/providers/react-query.provider';
import { useAuthStore } from '@/stores/auth.store';
import { ReactNode } from 'react';
import { useShallow } from 'zustand/react/shallow';

type Props = {
  children: ReactNode;
};

const AppLayout = ({ children }: Props) => {
  const { userRole } = useAuthStore(
    useShallow((state) => ({
      userRole: state.userRole,
    })),
  );

  const renderSidebar = (userRole: USER_ROLE) => {
    if (userRole === USER_ROLE.ADMIN) {
      return <AdminSidebar />;
    }
    if (userRole === USER_ROLE.MANAGER || userRole === USER_ROLE.STAFF) {
      return <UserSidebar />;
    }
    return <UserSidebar />;
  };
  return (
    <ReactQueryProvider>
      <SidebarProvider>
        {userRole && renderSidebar(userRole)}
        <SidebarInset>
          <SiteHeader />
          <div className='min-h-screen bg-secondary text-foreground antialiased'>{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </ReactQueryProvider>
  );
};

export default AppLayout;
