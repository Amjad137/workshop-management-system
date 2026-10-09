import { SelectFilter } from '@/components/ui/data-table/table-filter-select';
import { TableSearchFilter } from '@/components/ui/data-table/table-search-filter';
import { API_QUERY_PARAMS } from '@/constants/common.constants';
import { USER_QUERY_PARAMS, USER_ROLE } from '@/constants/user.constants';
import { Filter } from 'lucide-react';

const UsersFilterComponents = () => {
  // Filter out SUPER_ADMIN for regular admins
  const roleOptions = Object.values(USER_ROLE).map((status) => ({
    label: status,
    value: status,
  }));

  return (
    <div className='flex flex-wrap gap-3'>
      <TableSearchFilter
        placeholder='Search users...'
        paramKey={API_QUERY_PARAMS.SEARCH_KEY}
        className='md:w-48'
      />

      <SelectFilter
        options={[
          { label: 'Verified', value: 'true' },
          { label: 'Non-Verified', value: 'false' },
        ]}
        paramKey={USER_QUERY_PARAMS.VERIFIED}
        placeholder='Filter by verification'
        icon={<Filter className='h-4 w-4' />}
        className='min-w-56'
      />
      <SelectFilter
        options={roleOptions}
        paramKey={USER_QUERY_PARAMS.ROLE}
        placeholder='Filter by role'
        icon={<Filter className='h-4 w-4' />}
        className='min-w-56'
      />
    </div>
  );
};

export default UsersFilterComponents;
