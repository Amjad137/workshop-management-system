'use client';

import { LucideProps, Users, Mail, UserCheck, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ROUTES } from '@/constants/routes.constants';
import { useGetAllUsersCount } from '@/hooks/use-users';
import { useGetAllInvitations } from '@/hooks/use-invitations';
import Link from 'next/link';

interface IAdminCardData {
  logo: React.ComponentType<LucideProps>;
  title: string;
  value: string | number;
  subTitle: string;
  navString: string;
  isLoading?: boolean;
  accentColor: string;
  badgeBg: string;
}

export function AdminDashboardCards() {
  const { data: allUsersCount, isLoading: isLoadingUsersCount } = useGetAllUsersCount();
  const { data: invitations, isLoading: isLoadingInvitations } = useGetAllInvitations({ limit: 50 });

  const pendingInvitationsCount = (invitations || []).filter((inv) => !inv.isUsed).length;
  const claimedInvitationsCount = (invitations || []).filter((inv) => inv.isUsed).length;

  const adminCardData: IAdminCardData[] = [
    {
      logo: Users,
      title: 'Total Staff Accounts',
      value: allUsersCount ?? 0,
      subTitle: 'Active team & management profiles',
      navString: ROUTES.USERS_ROOT,
      isLoading: isLoadingUsersCount,
      accentColor: 'text-blue-500',
      badgeBg: 'bg-blue-500/10',
    },
    {
      logo: Mail,
      title: 'Pending Invitations',
      value: pendingInvitationsCount,
      subTitle: 'Unclaimed onboarding invite links',
      navString: ROUTES.INVITATIONS_ROOT,
      isLoading: isLoadingInvitations,
      accentColor: 'text-violet-500',
      badgeBg: 'bg-violet-500/10',
    },
    {
      logo: UserCheck,
      title: 'Claimed Invitations',
      value: claimedInvitationsCount,
      subTitle: 'Successfully completed on-boardings',
      navString: ROUTES.INVITATIONS_ROOT,
      isLoading: isLoadingInvitations,
      accentColor: 'text-emerald-500',
      badgeBg: 'bg-emerald-500/10',
    },
    {
      logo: Shield,
      title: 'Audit Logs & Governance',
      value: 'Enabled',
      subTitle: 'Role tracking & access control',
      navString: ROUTES.AUDIT_LOGS_ROOT,
      isLoading: false,
      accentColor: 'text-amber-500',
      badgeBg: 'bg-amber-500/10',
    },
  ];

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 px-4 lg:px-6'>
      {adminCardData.map((item, index) => (
        <Link
          key={index}
          href={item.navString}
          className='block group transition-all duration-200'
        >
          <Card className='h-full border border-border/70 hover:border-primary/40 hover:shadow-md transition-all duration-200'>
            <CardHeader className='pb-2 pt-4 px-4 flex flex-row items-center justify-between space-y-0'>
              <CardTitle className='text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                {item.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${item.badgeBg}`}>
                <item.logo className={`h-4 w-4 ${item.accentColor}`} />
              </div>
            </CardHeader>

            <CardContent className='px-4 pb-4 pt-1'>
              <div className='text-2xl sm:text-3xl font-bold tracking-tight text-foreground'>
                {item.isLoading ? (
                  <span className='inline-block h-8 w-12 animate-pulse rounded bg-muted' />
                ) : (
                  item.value
                )}
              </div>
              <p className='text-xs text-muted-foreground mt-1'>
                {item.subTitle}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

export default AdminDashboardCards;
