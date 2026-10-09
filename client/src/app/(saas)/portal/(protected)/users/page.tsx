'use client';

import UsersActionComponents from '@/components/saas/admin/users/users-action-components';
import UsersFilterComponents from '@/components/saas/admin/users/users-filter-components';
import { usersTableColumns } from '@/components/saas/admin/users/users-table-columns';
import PageLoader from '@/components/saas/shared/page-loader';
import { DataTable } from '@/components/ui/data-table/data-table';
import { API_QUERY_PARAMS, COMMON_SORT, ENTITY_SORT } from '@/constants/common.constants';
import { USER_QUERY_PARAMS, USER_ROLE } from '@/constants/user.constants';
import { IUserQuery } from '@/dto/user.dto';
import { useTableUrlSync } from '@/hooks/use-table-url-sync';
import { useGetAllUsers } from '@/hooks/use-users';
import { IUser } from '@/types/user.type';
import { Table } from '@tanstack/react-table';
import { useSearchParams } from 'next/navigation';

const UsersPage = () => {
  const searchParams = useSearchParams();
  // Initialize URL sync with a unique table ID
  useTableUrlSync();

  const queryParams: IUserQuery = {
    search_key: searchParams.get(API_QUERY_PARAMS.SEARCH_KEY) ?? undefined,
    sort_by: (searchParams.get(API_QUERY_PARAMS.SORT_BY) as COMMON_SORT) ?? COMMON_SORT.DATE,
    sort_order: (searchParams.get(API_QUERY_PARAMS.SORT_ORDER) as ENTITY_SORT) ?? ENTITY_SORT.DESC,
    skip: searchParams.get(API_QUERY_PARAMS.SKIP)
      ? Number(searchParams.get(API_QUERY_PARAMS.SKIP))
      : 0,
    limit: searchParams.get(API_QUERY_PARAMS.LIMIT)
      ? Number(searchParams.get(API_QUERY_PARAMS.LIMIT))
      : 20,
    role: (searchParams.get(USER_QUERY_PARAMS.ROLE) as USER_ROLE) ?? undefined,
  };

  const { data: users, extras, isLoading } = useGetAllUsers(queryParams);

  const renderUserActions = ({ table }: { table: Table<IUser> }) => (
    <UsersActionComponents
      table={table}
      currentVerification={queryParams.isActive ? 'true' : 'false'}
    />
  );

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className='container mx-auto flex h-full w-full gap-2 flex-col justify-start'>
      <DataTable
        columns={usersTableColumns}
        data={users || []}
        extras={extras}
        filterComponents={<UsersFilterComponents />}
        actionComponents={renderUserActions}
      />
    </div>
  );
};

export default UsersPage;
