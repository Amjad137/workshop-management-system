'use client';

import Link from 'next/link';
import { useAuthStore } from '@/stores/auth.store';
import { useGetAllInvitations } from '@/hooks/use-invitations';
import { useGetAllUsers } from '@/hooks/use-users';
import { ROUTES } from '@/constants/routes.constants';
import { USER_ROLE } from '@/constants/user.constants';
import { COMMON_SORT, ENTITY_SORT } from '@/constants/common.constants';
import { formatDateTime } from '@/utils/date-utils';
import { toast } from '@/hooks/use-toast';

import AdminDashboardCards from './admin-dashboard-cards';
import { InviteUserDialog } from '@/components/saas/admin/invitations/invite-user-dialog';
import { CreateUserDialog } from '@/components/saas/admin/users/create-user-dialog';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowRight,
  Clock,
  Copy,
  Mail,
  Shield,
  ShieldCheck,
  UserCheck,
  Users,
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, userRole } = useAuthStore();
  const isAdmin = userRole === USER_ROLE.ADMIN;

  const { data: recentInvitations } = useGetAllInvitations(
    { limit: 5, sort_by: 'createdAt', sort_order: 'desc' },
    { enabled: isAdmin },
  );

  const { data: recentUsers } = useGetAllUsers({
    limit: 5,
    sort_by: COMMON_SORT.DATE,
    sort_order: ENTITY_SORT.DESC,
  });

  const handleCopyInviteLink = (code: string) => {
    const url = `${window.location.origin}${ROUTES.SIGN_UP}?code=${code}`;
    navigator.clipboard.writeText(url);
    toast({
      title: 'Invite Link Copied 📋',
      description: 'Invite sign-up URL has been copied to your clipboard.',
    });
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case USER_ROLE.ADMIN:
        return 'destructive';
      case USER_ROLE.MANAGER:
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className='flex flex-col gap-6 p-4 lg:p-6 max-w-7xl mx-auto w-full'>
      {/* Executive Welcome & Actions Header */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 shadow-sm'>
        <div>
          <div className='flex items-center gap-2'>
            <Badge variant='outline' className='uppercase text-[10px] tracking-wider font-semibold font-mono bg-primary/10 text-primary border-primary/30'>
              Administrator Control Center
            </Badge>
            <span className='text-xs text-muted-foreground'>System Governance & Team Onboarding</span>
          </div>
          <h1 className='text-2xl sm:text-3xl font-bold tracking-tight mt-1 text-foreground'>
            Welcome back, {user?.name || 'Administrator'}! 👋
          </h1>
          <p className='text-sm text-muted-foreground mt-1 max-w-2xl'>
            Manage team invitations, oversee staff accounts, and monitor administrative security across the organisation.
          </p>
        </div>

        <div className='flex flex-wrap items-center gap-2.5'>
          <InviteUserDialog />
          <CreateUserDialog />
        </div>
      </div>

      {/* KPI Metric Cards */}
      <AdminDashboardCards />

      {/* Main Grid Section */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 lg:px-6'>
        {/* Left Column (2 cols): Recent Invitations & Role Matrix */}
        <div className='lg:col-span-2 space-y-6'>
          {/* Recent Staff Invitations */}
          <Card className='border border-border/70 shadow-sm'>
            <CardHeader className='pb-3 flex flex-row items-center justify-between'>
              <div>
                <CardTitle className='text-base font-bold tracking-tight flex items-center gap-2'>
                  <Mail className='h-4 w-4 text-primary' />
                  Recent Staff Invitations
                </CardTitle>
                <CardDescription className='text-xs mt-0.5'>
                  Onboarding tokens issued to staff and managers
                </CardDescription>
              </div>
              <Button asChild variant='ghost' size='sm' className='text-xs gap-1'>
                <Link href={ROUTES.INVITATIONS_ROOT}>
                  Manage All <ArrowRight className='h-3.5 w-3.5' />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className='pt-0'>
              {!recentInvitations || recentInvitations.length === 0 ? (
                <div className='py-8 text-center text-xs text-muted-foreground border border-dashed rounded-lg'>
                  <Mail className='h-8 w-8 text-muted-foreground/40 mx-auto mb-2' />
                  No invitations issued yet. Click &quot;Invite Staff Member&quot; to begin onboarding team members.
                </div>
              ) : (
                <div className='divide-y divide-border/60'>
                  {recentInvitations.map((inv) => (
                    <div
                      key={inv._id}
                      className='py-3 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5'
                    >
                      <div className='space-y-0.5 min-w-0'>
                        <div className='flex items-center gap-2'>
                          <span className='font-semibold text-xs text-foreground truncate'>
                            {inv.email}
                          </span>
                          <Badge variant='outline' className='text-[10px] uppercase font-mono px-1.5 py-0'>
                            {inv.role}
                          </Badge>
                          {inv.isUsed ? (
                            <Badge variant='secondary' className='text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'>
                              Claimed
                            </Badge>
                          ) : (
                            <Badge variant='secondary' className='text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'>
                              Pending
                            </Badge>
                          )}
                        </div>
                        <p className='text-[11px] text-muted-foreground flex items-center gap-1.5'>
                          <Clock className='h-3 w-3' />
                          Created: {formatDateTime(inv.createdAt)} &bull; Expires: {formatDateTime(inv.expiresAt)}
                        </p>
                      </div>

                      {!inv.isUsed && (
                        <Button
                          variant='outline'
                          size='sm'
                          className='h-7 text-xs gap-1.5 shrink-0 self-start sm:self-auto'
                          onClick={() => handleCopyInviteLink(inv.invitationCode)}
                        >
                          <Copy className='h-3 w-3' />
                          Copy Link
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Team Onboarding & Governance Overview */}
          <Card className='border border-border/70 shadow-sm'>
            <CardHeader className='pb-3'>
              <CardTitle className='text-base font-bold tracking-tight flex items-center gap-2'>
                <ShieldCheck className='h-4 w-4 text-emerald-500' />
                Team Onboarding & Account Governance Lifecycle
              </CardTitle>
              <CardDescription className='text-xs mt-0.5'>
                Centralised workflow for inviting, provisioning, and managing organizational access
              </CardDescription>
            </CardHeader>
            <CardContent className='pt-0 space-y-3'>
              <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
                <div className='rounded-lg border border-primary/20 bg-primary/5 p-3 space-y-1.5'>
                  <div className='flex items-center gap-1.5 font-semibold text-xs text-foreground'>
                    <Badge variant='outline' className='text-[9px] px-1 py-0 uppercase font-mono'>
                      STEP 1
                    </Badge>
                    <span>Issue Invitation</span>
                  </div>
                  <p className='text-[11px] text-muted-foreground'>
                    Generate time-bound invite tokens specifying the team member&apos;s role and email address.
                  </p>
                </div>

                <div className='rounded-lg border border-violet-500/20 bg-violet-500/5 p-3 space-y-1.5'>
                  <div className='flex items-center gap-1.5 font-semibold text-xs text-foreground'>
                    <Badge variant='secondary' className='text-[9px] px-1 py-0 uppercase font-mono'>
                      STEP 2
                    </Badge>
                    <span>Self-Service Sign-up</span>
                  </div>
                  <p className='text-[11px] text-muted-foreground'>
                    The invitee registers via the unique token link and securely creates their credentials.
                  </p>
                </div>

                <div className='rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 space-y-1.5'>
                  <div className='flex items-center gap-1.5 font-semibold text-xs text-foreground'>
                    <Badge variant='secondary' className='text-[9px] px-1 py-0 uppercase font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'>
                      STEP 3
                    </Badge>
                    <span>Account Provisioned</span>
                  </div>
                  <p className='text-[11px] text-muted-foreground'>
                    The new account is activated with designated permissions in the Staff Directory.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Recent Staff Accounts & Quick Shortcuts */}
        <div className='space-y-6'>
          {/* Recent Staff Accounts */}
          <Card className='border border-border/70 shadow-sm'>
            <CardHeader className='pb-3 flex flex-row items-center justify-between'>
              <div>
                <CardTitle className='text-base font-bold tracking-tight flex items-center gap-2'>
                  <Users className='h-4 w-4 text-blue-500' />
                  Staff Directory
                </CardTitle>
                <CardDescription className='text-xs mt-0.5'>
                  Recently registered team members
                </CardDescription>
              </div>
              <Button asChild variant='ghost' size='sm' className='text-xs gap-1'>
                <Link href={ROUTES.USERS_ROOT}>
                  All Users <ArrowRight className='h-3.5 w-3.5' />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className='pt-0'>
              {!recentUsers || recentUsers.length === 0 ? (
                <div className='py-8 text-center text-xs text-muted-foreground border border-dashed rounded-lg'>
                  No user records found.
                </div>
              ) : (
                <div className='divide-y divide-border/60'>
                  {recentUsers.map((u) => (
                    <div
                      key={u.id}
                      className='py-2.5 first:pt-1 last:pb-1 flex items-center justify-between gap-2'
                    >
                      <div className='min-w-0'>
                        <div className='flex items-center gap-1.5'>
                          <p className='text-xs font-semibold text-foreground truncate'>
                            {u.name}
                          </p>
                          <Badge
                            variant={getRoleBadgeVariant(u.role || '')}
                            className='text-[9px] px-1 py-0 uppercase font-mono'
                          >
                            {u.role || 'STAFF'}
                          </Badge>
                        </div>
                        <p className='text-[11px] text-muted-foreground truncate'>{u.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Administrator Quick Navigation */}
          <Card className='border border-border/70 shadow-sm bg-muted/20'>
            <CardHeader className='pb-3'>
              <CardTitle className='text-sm font-bold tracking-tight flex items-center gap-2'>
                <Shield className='h-4 w-4 text-primary' />
                Administrative Shortcuts
              </CardTitle>
            </CardHeader>
            <CardContent className='pt-0 space-y-2'>
              <Button asChild variant='outline' className='w-full justify-start text-xs h-9' size='sm'>
                <Link href={ROUTES.INVITATIONS_ROOT} className='gap-2'>
                  <Mail className='h-3.5 w-3.5 text-primary' />
                  Staff Invitations & Tokens
                </Link>
              </Button>
              <Button asChild variant='outline' className='w-full justify-start text-xs h-9' size='sm'>
                <Link href={ROUTES.USERS_ROOT} className='gap-2'>
                  <Users className='h-3.5 w-3.5 text-blue-500' />
                  Staff Account Management
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Security & Access Notice */}
          <div className='rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs text-muted-foreground space-y-1.5'>
            <div className='flex items-center gap-1.5 font-semibold text-foreground'>
              <UserCheck className='h-4 w-4 text-primary' />
              <span>Recommended Onboarding Flow</span>
            </div>
            <p>
              Invite staff and managers using their email address. Team members will receive an invite code allowing them to choose their own secure passwords.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
