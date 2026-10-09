'use client';

import { TableSearchFilter } from '@/components/ui/data-table/table-search-filter';
import { SelectFilter } from '@/components/ui/data-table/table-filter-select';
import { API_QUERY_PARAMS } from '@/constants/common.constants';
import { USER_ROLE } from '@/constants/user.constants';
import { Filter } from 'lucide-react';

export default function InvitationsFilterComponents() {
  const roleOptions = [
    { label: 'Staff', value: USER_ROLE.STAFF },
    { label: 'Manager', value: USER_ROLE.MANAGER },
    { label: 'Admin', value: USER_ROLE.ADMIN },
  ];

  const statusOptions = [
    { label: 'Pending Invites', value: 'false' },
    { label: 'Accepted Invites', value: 'true' },
  ];

  return (
    <div className='flex flex-wrap items-center gap-3'>
      <TableSearchFilter
        placeholder='Search by email or invite code...'
        paramKey={API_QUERY_PARAMS.SEARCH_KEY}
        className='w-64'
      />

      <SelectFilter
        options={roleOptions}
        paramKey='role'
        placeholder='Filter by role'
        icon={<Filter className='h-4 w-4' />}
        className='min-w-44'
      />

      <SelectFilter
        options={statusOptions}
        paramKey='isUsed'
        placeholder='Filter by status'
        icon={<Filter className='h-4 w-4' />}
        className='min-w-44'
      />
    </div>
  );
}
