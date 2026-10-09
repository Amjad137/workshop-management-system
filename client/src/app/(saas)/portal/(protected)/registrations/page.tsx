'use client';

import { useSearchParams } from 'next/navigation';
import { useTableUrlSync } from '@/hooks/use-table-url-sync';
import { useGetAllRegistrations } from '@/hooks/use-registrations';
import { IRegistration, IRegistrationQuery, REGISTRATION_STATUS } from '@/types/registration.type';
import { DataTable } from '@/components/ui/data-table/data-table';
import { registrationsTableColumns } from '@/components/saas/registrations/registrations-table-columns';
import RegistrationsFilterComponents from '@/components/saas/registrations/registrations-filter-components';
import RegistrationsActionComponents from '@/components/saas/registrations/registrations-action-components';
import PageLoader from '@/components/saas/shared/page-loader';
import { API_QUERY_PARAMS } from '@/constants/common.constants';
import { Card } from '@/components/ui/card';
import { Table } from '@tanstack/react-table';
import { ShieldCheck, User, AlertCircle } from 'lucide-react';

export default function RegistrationsPage() {
  const searchParams = useSearchParams();

  // Bidirectional synchronization between table-store and browser URL
  useTableUrlSync();

  const queryParams: IRegistrationQuery = {
    search_key: searchParams.get(API_QUERY_PARAMS.SEARCH_KEY) ?? undefined,
    sort_by: searchParams.get(API_QUERY_PARAMS.SORT_BY) ?? 'registeredAt',
    sort_order: (searchParams.get(API_QUERY_PARAMS.SORT_ORDER) as 'asc' | 'desc') ?? 'desc',
    skip: searchParams.get(API_QUERY_PARAMS.SKIP)
      ? Number(searchParams.get(API_QUERY_PARAMS.SKIP))
      : 0,
    limit: searchParams.get(API_QUERY_PARAMS.LIMIT)
      ? Number(searchParams.get(API_QUERY_PARAMS.LIMIT))
      : 20,
    status: searchParams.get(API_QUERY_PARAMS.STATUS) ?? undefined,
    workshopId: searchParams.get('workshopId') ?? undefined,
  };

  const { data: registrations, extras, isLoading } = useGetAllRegistrations(queryParams);

  const renderRegistrationActions = ({ table }: { table: Table<IRegistration> }) => (
    <RegistrationsActionComponents table={table} />
  );

  if (isLoading) {
    return <PageLoader />;
  }

  // Summary counts from current result set
  const activeCount = (registrations || []).filter(
    (r) => r.status === REGISTRATION_STATUS.REGISTERED,
  ).length;
  const cancelledCount = (registrations || []).filter(
    (r) => r.status === REGISTRATION_STATUS.CANCELLED,
  ).length;

  return (
    <div className='container mx-auto flex h-full w-full gap-4 flex-col justify-start p-6 max-w-7xl'>
      {/* Page Title & Explanation */}
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Registrations & Audit Trail</h1>
        <p className='text-sm text-muted-foreground mt-1'>
          Permanent, undeletable records of all attendee registrations, cancellations, and responsible staff.
        </p>
      </div>

      {/* KPI Metrics */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        <Card className='p-4 border-border shadow-sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                Total Registered Records
              </p>
              <h3 className='text-2xl font-bold mt-1'>{extras?.total ?? registrations?.length ?? 0}</h3>
            </div>
            <ShieldCheck className='h-8 w-8 text-primary/40' />
          </div>
        </Card>

        <Card className='p-4 border-border shadow-sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                Active on Page
              </p>
              <h3 className='text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1'>
                {activeCount}
              </h3>
            </div>
            <User className='h-8 w-8 text-emerald-500/40' />
          </div>
        </Card>

        <Card className='p-4 border-border shadow-sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                Cancelled on Page
              </p>
              <h3 className='text-2xl font-bold text-destructive mt-1'>{cancelledCount}</h3>
            </div>
            <AlertCircle className='h-8 w-8 text-destructive/40' />
          </div>
        </Card>
      </div>

      {/* Standard DataTable with URL Sync, Filters & Actions */}
      <DataTable
        columns={registrationsTableColumns}
        data={registrations || []}
        extras={extras}
        filterComponents={<RegistrationsFilterComponents />}
        actionComponents={renderRegistrationActions}
      />
    </div>
  );
}
