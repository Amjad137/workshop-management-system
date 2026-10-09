'use client';

import { Table } from '@tanstack/react-table';
import { InviteUserDialog } from './invite-user-dialog';

interface Props<TData> {
  table: Table<TData>;
}

export default function InvitationsActionComponents<TData>({ table }: Props<TData>) {
  const selectedCount = table.getSelectedRowModel().rows.length;

  return (
    <div className='flex items-center gap-3'>
      {selectedCount > 0 && (
        <span className='text-xs text-muted-foreground font-mono'>
          {selectedCount} item{selectedCount > 1 ? 's' : ''} selected
        </span>
      )}

      <InviteUserDialog />
    </div>
  );
}
