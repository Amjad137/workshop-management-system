'use client';

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
import { COMMON_SIDEBAR_MENU_ITEMS, SIDEBAR_MENU_CATEGORIES } from '@/constants/sidebar.constants';
import { VERSION } from '@/version';
import Image from 'next/image';
import Link from 'next/link';
import SidebarNavGroup from '../sidebar-nav-group';
import { SidebarUserMenu } from '../sidebar-user-menu';

export const USER_SIDEBAR_MENU = {
  HOME: COMMON_SIDEBAR_MENU_ITEMS.HOME,
  WORKSHOPS: COMMON_SIDEBAR_MENU_ITEMS.WORKSHOPS,
};

export function UserSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='offcanvas' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className='h-20 border-b border-border'>
            <SidebarMenuButton asChild className='data-[slot=sidebar-menu-button]:!p-1.5'>
              <div className='flex gap-1 h-full items-start'>
                <div className='flex items-center justify-center h-10 w-10 rounded-lg bg-primary text-primary-foreground font-bold text-xl'>
                  W
                </div>
                <Link href='#' className='flex flex-col gap-0'>
                  <span className='text-[20px] font-semibold text-primary'>Workshop Centre</span>
                  <span className='text-[10px] text-muted-foreground'>Registration Hub</span>
                </Link>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarNavGroup items={USER_SIDEBAR_MENU.HOME} title={SIDEBAR_MENU_CATEGORIES.HOME} />
        <SidebarNavGroup
          items={USER_SIDEBAR_MENU.WORKSHOPS}
          title={SIDEBAR_MENU_CATEGORIES.WORKSHOPS_MANAGEMENT}
        />
      </SidebarContent>
      <SidebarFooter>
        <SidebarUserMenu />
      </SidebarFooter>
    </Sidebar>
  );
}
