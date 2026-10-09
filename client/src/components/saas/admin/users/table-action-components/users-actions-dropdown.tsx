import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IUser } from '@/types/user.type';
import { KeyRound, MoreVertical, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import EditUserDialogAdmin from './edit-user-dialog-admin';
import ToggleUserVerificationDialog from './toggle-user-verification-dialog';

type Props = {
  rowData: IUser;
};

const UsersActionsDropdown = ({ rowData }: Props) => {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openVerificationDialog, setOpenVerificationDialog] = useState(false);

  const [openDropdown, setOpenDropdown] = useState(false);

  const openEdit = () => {
    setOpenDropdown(false);
    setOpenEditDialog(true);
  };

  const openVerificationToggle = () => {
    setOpenDropdown(false);
    setOpenVerificationDialog(true);
  };
  return (
    <>
      <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
        <DropdownMenuTrigger className='items-right w-full' asChild>
          <MoreVertical size={15} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className='mr-7' align='start'>
          <DropdownMenuItem onClick={() => openEdit()}>
            <KeyRound /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => openVerificationToggle()}>
            <ShieldCheck /> Toggle Verification
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* Only render dialogs when they're needed */}
      {openEditDialog && (
        <EditUserDialogAdmin open={openEditDialog} setOpen={setOpenEditDialog} userData={rowData} />
      )}

      {openVerificationDialog && (
        <ToggleUserVerificationDialog
          open={openVerificationDialog}
          setOpen={setOpenVerificationDialog}
          userId={rowData.id}
          email={rowData.email}
          currentVerificationStatus={rowData.emailVerified}
        />
      )}
    </>
  );
};

export default UsersActionsDropdown;
