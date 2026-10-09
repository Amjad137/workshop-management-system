'use client';

import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { IRegistration, REGISTRATION_STATUS } from '@/types/registration.type';
import { Ban, MoreVertical, FileText } from 'lucide-react';
import { CancelRegistrationDialog } from './cancel-registration-dialog';

interface Props {
  rowData: IRegistration;
}

export default function RegistrationsActionsDropdown({ rowData }: Props) {
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);

  const isCancelled = rowData.status === REGISTRATION_STATUS.CANCELLED;

  return (
    <>
      <div className='flex items-center justify-end'>
        {!isCancelled ? (
          <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
                <MoreVertical className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem
                className='text-destructive focus:text-destructive cursor-pointer'
                onClick={() => {
                  setOpenDropdown(false);
                  setOpenCancelDialog(true);
                }}
              >
                <Ban className='mr-2 h-4 w-4' />
                Cancel Registration
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <span className='text-xs text-muted-foreground flex items-center gap-1 font-mono'>
            <FileText className='h-3 w-3' /> Cancelled
          </span>
        )}
      </div>

      {openCancelDialog && (
        <CancelRegistrationDialog
          registration={rowData}
          open={openCancelDialog}
          onOpenChange={setOpenCancelDialog}
          onSuccess={() => setOpenCancelDialog(false)}
        />
      )}
    </>
  );
}
