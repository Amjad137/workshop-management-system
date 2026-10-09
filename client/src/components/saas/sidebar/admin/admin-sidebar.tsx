'use client';

import { Users } from 'lucide-react';
import * as React from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { ROUTES } from '@/constants/routes.constants';
import { COMMON_SIDEBAR_MENU_ITEMS, SIDEBAR_MENU_CATEGORIES } from '@/constants/sidebar.constants';
import { VERSION } from '@/version';
import Image from 'next/image';
import Link from 'next/link';
import SidebarNavGroup from '../sidebar-nav-group';
import { SidebarUserMenu } from '../sidebar-user-menu';

export const ADMIN_SIDEBAR_MENU = {
  HOME: COMMON_SIDEBAR_MENU_ITEMS.HOME,
  USERS: [
    {
      name: 'Users',
      url: ROUTES.USERS_ROOT,
      icon: Users,
    },
  ],
};

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='offcanvas' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className='h-20 border-b border-border'>
            <SidebarMenuButton asChild className='data-[slot=sidebar-menu-button]:!p-1.5'>
              <div className='flex gap-1 h-full items-start'>
                <Image
                  src={'/assets/images/biztock-icon.svg'}
                  alt='Biztock'
                  width={36}
                  height={36}
                  className='h-12 w-12'
                />
                <Link href='#' className='flex flex-col gap-0'>
                  <span className='text-[22px] font-semibold text-primary'>Biztock</span>
                  <span className='text-[10px]'>version {VERSION}</span>
                </Link>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarNavGroup items={ADMIN_SIDEBAR_MENU.HOME} title={SIDEBAR_MENU_CATEGORIES.HOME} />
        <SidebarNavGroup
          items={ADMIN_SIDEBAR_MENU.USERS}
          title={SIDEBAR_MENU_CATEGORIES.USERS_MANAGEMENT}
        />
      </SidebarContent>
      <SidebarFooter>
        <SidebarUserMenu />
      </SidebarFooter>
    </Sidebar>
  );
}
