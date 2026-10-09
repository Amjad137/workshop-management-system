'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTableUrlSync } from '@/hooks/use-table-url-sync';
import { useGetAllRegistrations, useGetAllWaitlists } from '@/hooks/use-registrations';
import { IRegistration, IRegistrationQuery, REGISTRATION_STATUS } from '@/types/registration.type';
import { DataTable } from '@/components/ui/data-table/data-table';
import { registrationsTableColumns } from '@/components/saas/registrations/registrations-table-columns';
import RegistrationsFilterComponents from '@/components/saas/registrations/registrations-filter-components';
import RegistrationsActionComponents from '@/components/saas/registrations/registrations-action-components';
import WaitlistQueuePanel from '@/components/saas/registrations/waitlist-queue-panel';
import PageLoader from '@/components/saas/shared/page-loader';
import { API_QUERY_PARAMS, ENTITY_SORT } from '@/constants/common.constants';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table } from '@tanstack/react-table';
import { ShieldCheck, User, AlertCircle, Clock } from 'lucide-react';

export default function RegistrationsPage() {
  const [activeTab, setActiveTab] = useState('registrations');
  const searchParams = useSearchParams();

  // Bidirectional synchronization between table-store and browser URL
  useTableUrlSync();

  const queryParams: IRegistrationQuery = {
    search_key: searchParams.get(API_QUERY_PARAMS.SEARCH_KEY) ?? undefined,
    sort_by: searchParams.get(API_QUERY_PARAMS.SORT_BY) ?? 'registeredAt',
    sort_order: (searchParams.get(API_QUERY_PARAMS.SORT_ORDER) as ENTITY_SORT) ?? ENTITY_SORT.DESC,
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
  const { data: waitlistItems, extras: waitlistExtras } = useGetAllWaitlists();

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
  const totalWaitlisted = waitlistExtras?.total ?? waitlistItems?.length ?? 0;

  return (
    <div className='container mx-auto flex h-full w-full gap-4 flex-col justify-start p-6 max-w-7xl'>
      {/* Page Title & Explanation */}
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Registrations & Attendee Management</h1>
        <p className='text-sm text-muted-foreground mt-1'>
          Permanent records of attendee bookings, cancellation audit trail, and active workshop waitlist queues.
        </p>
      </div>

      {/* KPI Metrics */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        <Card className='p-4 border-border shadow-sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                Total Records
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
                Active Confirmed
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
                Cancelled Records
              </p>
              <h3 className='text-2xl font-bold text-destructive mt-1'>{cancelledCount}</h3>
            </div>
            <AlertCircle className='h-8 w-8 text-destructive/40' />
          </div>
        </Card>

        <Card className='p-4 border-border shadow-sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                Waitlisted Queue
              </p>
              <h3 className='text-2xl font-bold text-violet-600 dark:text-violet-400 mt-1'>
                {totalWaitlisted}
              </h3>
            </div>
            <Clock className='h-8 w-8 text-violet-500/40' />
          </div>
        </Card>
      </div>

      {/* Mode Tabs: Confirmed vs Waitlist */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full space-y-4'>
        <div className='flex items-center justify-between border-b border-border pb-2'>
          <TabsList className='bg-muted/70'>
            <TabsTrigger value='registrations' className='gap-2 text-xs'>
              <ShieldCheck className='h-4 w-4' />
              Confirmed Registrations ({extras?.total ?? registrations?.length ?? 0})
            </TabsTrigger>
            <TabsTrigger value='waitlist' className='gap-2 text-xs'>
              <Clock className='h-4 w-4' />
              Waitlist Queue ({totalWaitlisted})
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value='registrations' className='space-y-4 m-0'>
          {/* Standard DataTable with URL Sync, Filters & Actions */}
          <DataTable
            columns={registrationsTableColumns}
            data={registrations || []}
            extras={extras}
            filterComponents={<RegistrationsFilterComponents />}
            actionComponents={renderRegistrationActions}
          />
        </TabsContent>

        <TabsContent value='waitlist' className='space-y-4 m-0'>
          <WaitlistQueuePanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
