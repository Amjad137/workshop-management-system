'use client';

import { CreditCardIcon, LogOutIcon, MoreVerticalIcon, UserCircleIcon } from 'lucide-react';

import UpdatePasswordModal from '@/components/saas/auth/update-password-modal';
import EditUserDialog from '@/components/saas/shared/user-edit-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useSignOut } from '@/hooks/use-auth';
import { useAuthStore } from '@/stores/auth.store';
import { IUser } from '@/types/user.type';
import { getUserFullName, getUserInitials } from '@/utils/user-utils';
import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

export const SidebarUserMenu = () => {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const signOut = useSignOut();

  const { isMobile } = useSidebar();
  const { user } = useAuthStore(
    useShallow((state) => ({
      user: state.user,
    })),
  );

  const openEdit = () => {
    setOpenDropdown(false);
    setOpenEditDialog(true);
  };
  const openEditPassword = () => {
    setOpenDropdown(false);
    setOpenPasswordModal(true);
  };
  return (
    <SidebarMenu>
      <SidebarMenuItem className='cursor-pointer shadow-lg'>
        <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size='lg'>
              <Avatar>
                <AvatarImage src={user?.image ?? undefined} />
                <AvatarFallback>{getUserInitials(user)}</AvatarFallback>
              </Avatar>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-medium'>{getUserFullName(user)}</span>
              </div>
              <MoreVerticalIcon className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
            side={isMobile ? 'bottom' : 'right'}
            align='end'
            sideOffset={4}
          >
            <DropdownMenuLabel className='p-0 font-normal'>
              <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                <Avatar>
                  <AvatarImage src={user?.image ?? undefined} />
                  <AvatarFallback>{getUserInitials(user)}</AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-medium'>{getUserFullName(user)}</span>
                  <span className='truncate text-xs text-muted-foreground'>{user?.role}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => openEdit()}>
                <UserCircleIcon />
                Edit Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={openEditPassword}>
                <CreditCardIcon />
                Edit Password
              </DropdownMenuItem>
              {/* <DropdownMenuItem
                onClick={() => router.push(ROUTES.NOTIFICATIONS)}
                className='cursor-pointer'
              >
                <BellIcon />
                <span className='flex items-center justify-between w-full gap-2'>
                  Notifications
                  {!isUnreadLoading && <Badge>{unreadCount}</Badge>}
                </span>
              </DropdownMenuItem> */}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOutIcon />
              <button className='w-full text-start' onClick={() => signOut.mutate()}>
                Sign Out
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {openEditDialog && (
          <EditUserDialog
            open={openEditDialog}
            setOpen={setOpenEditDialog}
            userData={user as IUser}
          />
        )}
        {openPasswordModal && (
          <UpdatePasswordModal open={openPasswordModal} setOpen={setOpenPasswordModal} />
        )}
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
