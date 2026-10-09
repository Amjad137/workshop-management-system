'use client';

import { useSearchParams } from 'next/navigation';
import { useTableUrlSync } from '@/hooks/use-table-url-sync';
import { useGetAllInvitations } from '@/hooks/use-invitations';
import { IInvitationQuery, IUserInvitation } from '@/types/invitation.type';
import { DataTable } from '@/components/ui/data-table/data-table';
import { invitationsTableColumns } from '@/components/saas/admin/invitations/invitations-table-columns';
import InvitationsFilterComponents from '@/components/saas/admin/invitations/invitations-filter-components';
import InvitationsActionComponents from '@/components/saas/admin/invitations/invitations-action-components';
import PageLoader from '@/components/saas/shared/page-loader';
import { API_QUERY_PARAMS, ENTITY_SORT } from '@/constants/common.constants';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table } from '@tanstack/react-table';
import { Mail, Clock, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { USER_ROLE } from '@/constants/user.constants';
import { ROUTES } from '@/constants/routes.constants';
import Link from 'next/link';

export default function InvitationsPage() {
  const searchParams = useSearchParams();
  const { userRole, isInitialized } = useAuthStore();
  const isAdmin = userRole === USER_ROLE.ADMIN;

  // Bidirectional synchronization between table-store and browser URL
  useTableUrlSync();

  const isUsedParam = searchParams.get('isUsed');

  const queryParams: IInvitationQuery = {
    search_key: searchParams.get(API_QUERY_PARAMS.SEARCH_KEY) ?? undefined,
    sort_by: searchParams.get(API_QUERY_PARAMS.SORT_BY) ?? 'createdAt',
    sort_order: (searchParams.get(API_QUERY_PARAMS.SORT_ORDER) as ENTITY_SORT) ?? ENTITY_SORT.DESC,
    skip: searchParams.get(API_QUERY_PARAMS.SKIP)
      ? Number(searchParams.get(API_QUERY_PARAMS.SKIP))
      : 0,
    limit: searchParams.get(API_QUERY_PARAMS.LIMIT)
      ? Number(searchParams.get(API_QUERY_PARAMS.LIMIT))
      : 20,
    role: searchParams.get('role') ?? undefined,
    isUsed: isUsedParam !== null ? isUsedParam === 'true' : undefined,
  };

  const { data: invitations, extras, isLoading } = useGetAllInvitations(queryParams, {
    enabled: isAdmin,
  });

  const renderInvitationActions = ({ table }: { table: Table<IUserInvitation> }) => (
    <InvitationsActionComponents table={table} />
  );

  if (!isInitialized) {
    return <PageLoader />;
  }

  if (!isAdmin) {
    return (
      <div className='container mx-auto flex h-full w-full items-center justify-center p-6 min-h-[60vh]'>
        <Card className='max-w-md w-full p-6 text-center space-y-4 border-destructive/20 shadow-md'>
          <div className='mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive'>
            <ShieldAlert className='h-7 w-7' />
          </div>
          <div className='space-y-1.5'>
            <h2 className='text-xl font-bold tracking-tight'>Administrator Access Required</h2>
            <p className='text-xs text-muted-foreground'>
              Managing staff invitations is restricted to administrators only. You do not have permission to view or manage invitation tokens.
            </p>
          </div>
          <Button asChild className='w-full'>
            <Link href={ROUTES.SAAS_ROOT}>Return to Dashboard</Link>
          </Button>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return <PageLoader />;
  }

  const pendingCount = (invitations || []).filter((inv) => !inv.isUsed).length;
  const acceptedCount = (invitations || []).filter((inv) => inv.isUsed).length;

  return (
    <div className='container mx-auto flex h-full w-full gap-4 flex-col justify-start p-6 max-w-7xl'>
      {/* Page Title & Explanation */}
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Staff & Manager Invitations</h1>
        <p className='text-sm text-muted-foreground mt-1'>
          Issue secure invitation links allowing new team members to set their own passwords upon onboarding.
        </p>
      </div>

      {/* KPI Metrics */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        <Card className='p-4 border-border shadow-sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                Total Invitations
              </p>
              <h3 className='text-2xl font-bold mt-1'>{extras?.total ?? invitations?.length ?? 0}</h3>
            </div>
            <Mail className='h-8 w-8 text-primary/40' />
          </div>
        </Card>

        <Card className='p-4 border-border shadow-sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                Pending on Page
              </p>
              <h3 className='text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1'>
                {pendingCount}
              </h3>
            </div>
            <Clock className='h-8 w-8 text-amber-500/40' />
          </div>
        </Card>

        <Card className='p-4 border-border shadow-sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                Accepted on Page
              </p>
              <h3 className='text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1'>
                {acceptedCount}
              </h3>
            </div>
            <CheckCircle2 className='h-8 w-8 text-emerald-500/40' />
          </div>
        </Card>
      </div>

      {/* Standard DataTable with URL Sync, Filters & Actions */}
      <DataTable
        columns={invitationsTableColumns}
        data={invitations || []}
        extras={extras}
        filterComponents={<InvitationsFilterComponents />}
        actionComponents={renderInvitationActions}
      />
    </div>
  );
}
