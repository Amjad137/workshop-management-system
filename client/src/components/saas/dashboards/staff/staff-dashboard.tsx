'use client';

import { useGetAllWorkshops } from '@/hooks/use-workshops';
import { useGetAllRegistrations } from '@/hooks/use-registrations';
import { useAuthStore } from '@/stores/auth.store';
import { USER_ROLE } from '@/constants/user.constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Calendar,
  Ticket,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Clock,
} from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes.constants';
import { ENTITY_SORT } from '@/constants/common.constants';

export default function StaffDashboard() {
  const { user, userRole } = useAuthStore();
  const isManager = userRole === USER_ROLE.MANAGER;

  const { data: workshops, extras: workshopsExtras } = useGetAllWorkshops({
    limit: 6,
    sort_by: 'date',
    sort_order: ENTITY_SORT.ASC,
  });

  const { data: registrations, extras: registrationsExtras } = useGetAllRegistrations({
    limit: 5,
  });

  const totalWorkshops = workshopsExtras?.total ?? workshops.length;
  const totalRegistrations = registrationsExtras?.total ?? registrations.length;

  return (
    <div className='p-6 space-y-6 max-w-7xl mx-auto'>
      {/* Welcome Banner */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 shadow-sm'>
        <div>
          <div className='flex items-center gap-2'>
            <Badge variant='outline' className='uppercase text-[10px] tracking-wider font-semibold font-mono'>
              {userRole} Portal
            </Badge>
            <span className='text-xs text-muted-foreground'>Community Training Centre</span>
          </div>
          <h1 className='text-2xl sm:text-3xl font-bold tracking-tight mt-1 text-foreground'>
            Welcome back, {user?.name || 'Team Member'}! 👋
          </h1>
          <p className='text-sm text-muted-foreground mt-1 max-w-xl'>
            {isManager
              ? 'Oversee workshop schedules, capacity management, and registration transactions.'
              : 'Fast-track phone & walk-in attendee registrations and prevent seat overbooking.'}
          </p>
        </div>

        <div className='flex items-center gap-3'>
          <Button asChild className='gap-2 shadow-sm'>
            <Link href={ROUTES.WORKSHOPS_ROOT}>
              <Calendar className='h-4 w-4' />
              View Workshops
            </Link>
          </Button>
          <Button asChild variant='outline' className='gap-2'>
            <Link href={ROUTES.REGISTRATIONS_ROOT}>
              <Ticket className='h-4 w-4' />
              Registrations
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        <Card className='shadow-sm border-border'>
          <CardHeader className='pb-2 pt-4 px-4'>
            <CardTitle className='text-xs font-medium text-muted-foreground uppercase tracking-wider'>
              Total Workshops
            </CardTitle>
          </CardHeader>
          <CardContent className='px-4 pb-4'>
            <div className='flex items-center justify-between'>
              <span className='text-2xl font-bold'>{totalWorkshops}</span>
              <Calendar className='h-5 w-5 text-primary/60' />
            </div>
          </CardContent>
        </Card>

        <Card className='shadow-sm border-border'>
          <CardHeader className='pb-2 pt-4 px-4'>
            <CardTitle className='text-xs font-medium text-muted-foreground uppercase tracking-wider'>
              Total Registrations
            </CardTitle>
          </CardHeader>
          <CardContent className='px-4 pb-4'>
            <div className='flex items-center justify-between'>
              <span className='text-2xl font-bold text-primary'>{totalRegistrations}</span>
              <Ticket className='h-5 w-5 text-primary/60' />
            </div>
          </CardContent>
        </Card>

        <Card className='shadow-sm border-border'>
          <CardHeader className='pb-2 pt-4 px-4'>
            <CardTitle className='text-xs font-medium text-muted-foreground uppercase tracking-wider'>
              Active Training Centres
            </CardTitle>
          </CardHeader>
          <CardContent className='px-4 pb-4'>
            <div className='flex items-center justify-between'>
              <span className='text-2xl font-bold'>3 Locations</span>
              <MapPin className='h-5 w-5 text-emerald-500/60' />
            </div>
          </CardContent>
        </Card>

        <Card className='shadow-sm border-border'>
          <CardHeader className='pb-2 pt-4 px-4'>
            <CardTitle className='text-xs font-medium text-muted-foreground uppercase tracking-wider'>
              Capacity Concurrency Guard
            </CardTitle>
          </CardHeader>
          <CardContent className='px-4 pb-4'>
            <div className='flex items-center justify-between'>
              <Badge className='bg-emerald-600/15 text-emerald-700 dark:text-emerald-400 font-semibold'>
                Active & Enforced
              </Badge>
              <CheckCircle2 className='h-5 w-5 text-emerald-500' />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Split */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Next Upcoming Workshops */}
        <div className='lg:col-span-2 space-y-4'>
          <div className='flex items-center justify-between'>
            <div>
              <h2 className='text-lg font-bold tracking-tight'>Upcoming Workshops</h2>
              <p className='text-xs text-muted-foreground'>Next scheduled training sessions</p>
            </div>
            <Button asChild variant='ghost' size='sm' className='gap-1 text-xs'>
              <Link href={ROUTES.WORKSHOPS_ROOT}>
                View all <ArrowRight className='h-3.5 w-3.5' />
              </Link>
            </Button>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            {workshops.slice(0, 4).map((ws) => {
              const seatsLeft = ws.capacity - ws.activeRegistrationsCount;
              const isFull = seatsLeft <= 0;
              const percentage = Math.min(100, Math.round((ws.activeRegistrationsCount / ws.capacity) * 100));

              return (
                <Card key={ws._id} className='p-4 space-y-3 hover:shadow-md transition-shadow border-border'>
                  <div className='flex items-start justify-between gap-2'>
                    <Badge variant='outline' className='font-mono text-xs font-bold'>
                      {ws.code}
                    </Badge>
                    <Badge variant={isFull ? 'destructive' : 'secondary'} className='text-[10px]'>
                      {isFull ? 'Full' : `${seatsLeft} seats left`}
                    </Badge>
                  </div>

                  <div>
                    <h3 className='font-semibold text-sm line-clamp-1'>{ws.title}</h3>
                    <p className='text-xs text-muted-foreground flex items-center gap-1.5 mt-1'>
                      <MapPin className='h-3 w-3 text-primary shrink-0' />
                      {ws.location}
                    </p>
                  </div>

                  <div className='space-y-1 text-xs'>
                    <div className='flex justify-between text-muted-foreground'>
                      <span>Seats</span>
                      <span>{ws.activeRegistrationsCount} / {ws.capacity}</span>
                    </div>
                    <Progress value={percentage} className={isFull ? '[&>div]:bg-destructive' : ''} />
                  </div>

                  <Button asChild size='sm' className='w-full text-xs h-8'>
                    <Link href={ROUTES.WORKSHOPS_ROOT}>
                      Manage / Register
                    </Link>
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Registrations Feed */}
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div>
              <h2 className='text-lg font-bold tracking-tight'>Recent Activity</h2>
              <p className='text-xs text-muted-foreground'>Latest registrations & cancellations</p>
            </div>
            <Button asChild variant='ghost' size='sm' className='gap-1 text-xs'>
              <Link href={ROUTES.REGISTRATIONS_ROOT}>
                History <ArrowRight className='h-3.5 w-3.5' />
              </Link>
            </Button>
          </div>

          <Card className='p-4 border-border divide-y divide-border'>
            {registrations.length === 0 ? (
              <p className='text-xs text-muted-foreground p-4 text-center'>No recent records.</p>
            ) : (
              registrations.slice(0, 5).map((reg) => {
                const isCancelled = reg.status === 'CANCELLED';
                return (
                  <div key={reg._id} className='py-3 first:pt-0 last:pb-0 space-y-1'>
                    <div className='flex items-center justify-between'>
                      <span className='text-xs font-semibold text-foreground'>{reg.attendeeName}</span>
                      <Badge
                        variant={isCancelled ? 'destructive' : 'outline'}
                        className='text-[9px] px-1.5 py-0'
                      >
                        {reg.status}
                      </Badge>
                    </div>
                    <p className='text-[11px] text-muted-foreground'>{reg.attendeeEmail}</p>
                    <p className='text-[10px] text-muted-foreground flex items-center gap-1'>
                      <Clock className='h-2.5 w-2.5' />
                      by {reg.registeredBy?.name || 'Staff'}
                    </p>
                  </div>
                );
              })
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
