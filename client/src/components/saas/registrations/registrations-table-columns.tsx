'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/data-table/table-column-header';
import { IRegistration, REGISTRATION_STATUS } from '@/types/registration.type';
import RegistrationsActionsDropdown from './registrations-actions-dropdown';
import { User, Calendar, ShieldAlert } from 'lucide-react';
import { formatDateTime } from '@/utils/date-utils';

export const registrationsTableColumns: ColumnDef<IRegistration>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'attendeeName',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Attendee' />,
    cell: ({ row }) => {
      const reg = row.original;
      return (
        <div className='flex flex-col text-xs'>
          <span className='font-semibold text-foreground'>{reg.attendeeName}</span>
          <span className='text-muted-foreground'>{reg.attendeeEmail}</span>
          {reg.notes && (
            <span className='text-[11px] text-muted-foreground/80 italic mt-0.5 max-w-[240px] truncate'>
              &ldquo;{reg.notes}&rdquo;
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'workshopId',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Workshop' />,
    cell: ({ row }) => {
      const workshop = row.original.workshopId;
      const isPopulated = typeof workshop === 'object' && workshop !== null;
      const code = isPopulated ? workshop.code : 'WS';
      const title = isPopulated ? workshop.title : String(workshop);
      const location = isPopulated ? workshop.location : '';

      return (
        <div className='flex flex-col gap-0.5 text-xs max-w-[220px]'>
          <div className='flex items-center gap-1.5'>
            <Badge variant='outline' className='font-mono text-[10px] font-bold'>
              {code}
            </Badge>
            <span className='font-medium truncate'>{title}</span>
          </div>
          {location && <span className='text-[11px] text-muted-foreground'>{location}</span>}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
    cell: ({ row }) => {
      const isCancelled = row.original.status === REGISTRATION_STATUS.CANCELLED;
      return (
        <Badge
          variant={isCancelled ? 'destructive' : 'secondary'}
          className={
            !isCancelled
              ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-semibold'
              : 'font-semibold'
          }
        >
          {isCancelled ? 'CANCELLED' : 'ACTIVE'}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'registeredAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Registered Audit' />,
    cell: ({ row }) => {
      const reg = row.original;
      return (
        <div className='flex flex-col text-xs text-muted-foreground'>
          <div className='flex items-center gap-1 text-foreground font-medium'>
            <Calendar className='h-3 w-3 text-muted-foreground' />
            {formatDateTime(reg.registeredAt)}
          </div>
          <div className='flex items-center gap-1 mt-0.5'>
            <User className='h-3 w-3' />
            <span>by {reg.registeredBy?.name || 'Staff'}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'cancelledAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Cancellation Audit' />,
    cell: ({ row }) => {
      const reg = row.original;
      if (reg.status !== REGISTRATION_STATUS.CANCELLED) {
        return <span className='text-muted-foreground text-xs'>—</span>;
      }

      return (
        <div className='flex flex-col text-xs text-destructive max-w-[240px]'>
          <div className='flex items-center gap-1 font-medium'>
            <ShieldAlert className='h-3 w-3' />
            {formatDateTime(reg.cancelledAt)}
          </div>
          <span className='text-[11px] text-muted-foreground'>
            by {reg.cancelledBy?.name || 'Staff'}
          </span>
          {reg.cancellationReason && (
            <span className='text-[11px] text-muted-foreground italic truncate mt-0.5'>
              Reason: &ldquo;{reg.cancellationReason}&rdquo;
            </span>
          )}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: 'selectedRowsAndActions',
    header: ({ table }) => {
      const count = table.getSelectedRowModel().rows.length;
      return (
        <div className='flex items-center justify-end w-full'>
          <span className='text-xs text-muted-foreground'>{count ? `${count} Selected` : ''}</span>
        </div>
      );
    },
    cell: ({ row }) => <RegistrationsActionsDropdown rowData={row.original} />,
    enableSorting: false,
  },
];
