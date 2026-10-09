import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/ui/data-table/table-column-header';
import { IUser } from '@/types/user.type';
import { getUserInitials } from '@/utils/user-utils';
import { ColumnDef, FilterFn } from '@tanstack/react-table';
import UsersActionsDropdown from './table-action-components/users-actions-dropdown';

const multiColumnFilterFn: FilterFn<IUser> = (row, columnId, filterValue) => {
  const searchableRowContent = `${row.original.email} ${row.original.name ?? ''} ${
    row.original.username ?? ''
  }`;
  return searchableRowContent.toLowerCase().includes(filterValue.toLowerCase());
};

export const usersTableColumns: ColumnDef<IUser>[] = [
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
    accessorKey: 'id',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title='User ID' />;
    },
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title='Full Name' />;
    },
    cell: ({ row }) => {
      const fullName = row.original.name ?? row.original.email;
      return (
        <div className='flex items-center gap-2 text-xs font-normal text-left max-w-[200px] break-words text-foreground'>
          <Avatar>
            <AvatarImage src={row.original.image ?? undefined} className='object-cover' />
            <AvatarFallback>{getUserInitials(row.original)}</AvatarFallback>
          </Avatar>
          <span className='break-words'>{fullName}</span>
        </div>
      );
    },
    filterFn: multiColumnFilterFn,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title='User Email' />;
    },
    filterFn: multiColumnFilterFn,
  },
  {
    accessorKey: 'phoneNumber',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title='Phone Number' />;
    },
    filterFn: multiColumnFilterFn,
  },
  {
    accessorKey: 'role',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title='Role' />;
    },
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
    filterFn: multiColumnFilterFn,
  },

  {
    accessorKey: 'banned',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title='Active' />;
    },
    cell: ({ row }) => {
      const isActive = !row.original.banned;
      return (
        <Badge
          className='font-medium w-14 justify-center'
          variant={`${isActive ? 'default' : 'destructive'}`}
        >
          {String(isActive)}
        </Badge>
      );
    },
    filterFn: multiColumnFilterFn,
  },

  {
    accessorKey: 'selectedRowsAndActions',
    header: ({ table }) => {
      const noOfSelectedRows = table.getSelectedRowModel().rows.length;
      return (
        <div className='flex items-center w-full gap-2'>
          <span className='flex justify-end text-muted-foreground w-full text-xs text-end'>
            {noOfSelectedRows} Selected
          </span>
        </div>
      );
    },
    cell: ({ row }) => {
      return <UsersActionsDropdown rowData={row.original} />;
    },
  },
];
