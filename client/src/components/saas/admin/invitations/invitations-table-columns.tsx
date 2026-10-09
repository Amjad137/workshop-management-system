'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table/table-column-header';
import { IUserInvitation } from '@/types/invitation.type';
import { useRevokeInvitation } from '@/hooks/use-invitations';
import { toast } from '@/hooks/use-toast';
import { Copy, Trash2, Mail, Calendar } from 'lucide-react';
import { formatDateTime } from '@/utils/date-utils';

function CopyCodeButton({ code }: { code: string }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    toast({
      title: 'Copied!',
      description: `Invitation code ${code} copied to clipboard.`,
    });
  };

  return (
    <Button
      variant='ghost'
      size='sm'
      onClick={handleCopy}
      className='h-6 px-1.5 text-xs text-muted-foreground hover:text-foreground gap-1 font-mono'
    >
      <span>{code}</span>
      <Copy className='h-3 w-3' />
    </Button>
  );
}

function RevokeInviteButton({ invite }: { invite: IUserInvitation }) {
  const revokeMutation = useRevokeInvitation();

  if (invite.isUsed) return null;

  return (
    <Button
      variant='ghost'
      size='sm'
      onClick={() => revokeMutation.mutateAsync(invite._id)}
      disabled={revokeMutation.isPending}
      className='h-8 text-destructive hover:text-destructive hover:bg-destructive/10'
      title='Revoke Invitation'
    >
      <Trash2 className='h-4 w-4' />
    </Button>
  );
}

export const invitationsTableColumns: ColumnDef<IUserInvitation>[] = [
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
    accessorKey: 'email',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Invited Email' />,
    cell: ({ row }) => (
      <div className='flex items-center gap-2 text-xs font-medium'>
        <Mail className='h-3.5 w-3.5 text-muted-foreground shrink-0' />
        <span className='text-foreground'>{row.original.email}</span>
      </div>
    ),
  },
  {
    accessorKey: 'role',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Role' />,
    cell: ({ row }) => {
      const role = String(row.original.role || 'staff').toUpperCase();
      const variant =
        role === 'ADMIN' ? 'default' : role === 'MANAGER' ? 'secondary' : 'outline';
      return (
        <Badge variant={variant} className='font-mono text-[11px] font-semibold'>
          {role}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'invitationCode',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Invitation Code' />,
    cell: ({ row }) => <CopyCodeButton code={row.original.invitationCode} />,
    enableSorting: false,
  },
  {
    accessorKey: 'isUsed',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
    cell: ({ row }) => {
      const invite = row.original;
      const isExpired = new Date(invite.expiresAt) < new Date();

      if (invite.isUsed) {
        return (
          <Badge className='bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-semibold'>
            ACCEPTED
          </Badge>
        );
      }

      if (isExpired) {
        return <Badge variant='destructive'>EXPIRED</Badge>;
      }

      return (
        <Badge className='bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/20 font-semibold'>
          PENDING
        </Badge>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Sent At' />,
    cell: ({ row }) => (
      <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
        <Calendar className='h-3 w-3' />
        <span>{formatDateTime(row.original.createdAt)}</span>
      </div>
    ),
  },
  {
    accessorKey: 'expiresAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Expires' />,
    cell: ({ row }) => (
      <span className='text-xs text-muted-foreground'>{formatDateTime(row.original.expiresAt)}</span>
    ),
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
    cell: ({ row }) => (
      <div className='flex items-center justify-end'>
        <RevokeInviteButton invite={row.original} />
      </div>
    ),
    enableSorting: false,
  },
];
