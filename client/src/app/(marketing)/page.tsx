import Link from 'next/link';
import { ROUTES } from '@/constants/routes.constants';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Calendar,
  Users,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  Lock,
  Building2,
  Sparkles,
  Clock,
  Laptop,
  Flame,
  FileCheck2,
  History,
  KeyRound,
} from 'lucide-react';

export const metadata = {
  title: 'Community Training Hub | Workshop Registration System',
  description:
    'High-reliability workshop management system with atomic concurrency reservations, strict RBAC, and undeletable audit logs.',
};

export default function HomePage() {
  const LOCATIONS = [
    {
      name: 'Downtown Studio',
      address: '104 Market Street, Arts District',
      capacity: 'Pottery, Ceramics & Creative Arts',
      color: 'from-amber-500/10 to-orange-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400',
    },
    {
      name: 'North Campus',
      address: '42 Science Park Blvd, Tech Quad',
      capacity: 'Full-Stack Coding, Python & Cloud Computing',
      color: 'from-blue-500/10 to-indigo-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400',
    },
    {
      name: 'West End Hub',
      address: '88 Riverfront Avenue, Suite 12',
      capacity: 'Health & Fitness, Yoga & Culinary Skills',
      color: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400',
    },
  ];

  const SYSTEM_ROLES = [
    {
      title: 'Front-Desk Staff',
      badge: 'STAFF ROLE',
      icon: Users,
      desc: 'Optimised for fast phone bookings & walk-ins. Register attendees atomically, cancel seats with reasons, and view live workshop rosters.',
      permissions: ['Register Walk-In & Phone Attendees', 'Release Seats with Cancellation Reason', 'View Real-Time Workshop Capacity'],
    },
    {
      title: 'Programme Manager',
      badge: 'MANAGER ROLE',
      icon: Calendar,
      desc: 'Total oversight of workshop catalog and scheduling. Create new sessions, adjust capacities, track attendance logs, and supervise bookings.',
      permissions: ['Create & Edit Workshop Catalog', 'Register & Cancel Attendee Bookings', 'Inspect Full Attendee Audit History'],
    },
    {
      title: 'System Administrator',
      badge: 'ADMIN ROLE',
      icon: Lock,
      desc: 'Strict security governance. Provision and manage staff and manager credentials with zero operational interference in registration workflows.',
      permissions: ['Provision Staff & Manager Accounts', 'System-Wide User Access Management', 'Strict RBAC Boundary Enforcement'],
    },
  ];

  const CORE_PILLARS = [
    {
      icon: Zap,
      title: 'Zero Overbooking Guarantee',
      desc: 'Atomic single-document MongoDB operations ($expr: { $lt: ["$activeRegistrationsCount", "$capacity"] }) eliminate race conditions during simultaneous booking spikes.',
    },
    {
      icon: History,
      title: 'Permanent Audit Trail',
      desc: 'Cancellations free seats immediately without deleting records. Full audit history with timestamps, responsible staff actor, and cancellation reason is preserved.',
    },
    {
      icon: ShieldCheck,
      title: 'Strict RBAC Security',
      desc: 'Enforced at both API route middleware and UI navigation levels. Administrators manage accounts; Managers and Staff manage workshops.',
    },
    {
      icon: FileCheck2,
      title: 'Automatic Waitlist Queue',
      desc: 'When capacity hits maximum, attendees are seamlessly channeled into a dedicated waitlist queue for instant priority when seats become available.',
    },
  ];

  return (
    <div className='min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20'>
      {/* Navigation Bar */}
      <header className='sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/40 px-6 py-4'>
        <div className='max-w-7xl mx-auto flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold shadow-sm'>
              <Building2 className='h-5 w-5' />
            </div>
            <div>
              <div className='flex items-center gap-2'>
                <span className='font-bold text-lg tracking-tight'>WorkshopHub</span>
                <Badge variant='outline' className='text-[10px] px-1.5 py-0 font-mono text-primary border-primary/30'>
                  ENTERPRISE
                </Badge>
              </div>
              <p className='text-[11px] text-muted-foreground leading-none'>Community Training Centre</p>
            </div>
          </div>

          <div className='flex items-center gap-3'>
            <Button asChild variant='ghost' size='sm' className='hidden sm:inline-flex'>
              <Link href={ROUTES.SIGN_IN}>Sign In</Link>
            </Button>
            <Button asChild size='sm' className='gap-2 shadow-sm'>
              <Link href={ROUTES.SAAS_ROOT}>
                Launch Portal
                <ArrowRight className='h-4 w-4' />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className='relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 px-6'>
        {/* Ambient Gradient Glows */}
        <div className='absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-primary/15 rounded-full blur-3xl pointer-events-none -z-10' />
        <div className='absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10' />

        <div className='max-w-5xl mx-auto text-center space-y-6'>
          <div className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-medium shadow-sm'>
            <Sparkles className='h-3.5 w-3.5 animate-pulse' />
            <span>Community Training Centre • 3 Locations • 15 Front Desk Staff</span>
          </div>

          <h1 className='text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight text-foreground'>
            High-Performance Workshop <br className='hidden sm:block' />
            <span className='bg-gradient-to-r from-primary via-primary/80 to-blue-600 bg-clip-text text-transparent'>
              Registration & Capacity Service
            </span>
          </h1>

          <p className='text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed'>
            Built for high-volume phone & walk-in bookings. Features atomic race-condition-free reservations,
            permanent audit tracking for cancellations, and strict 3-tier role governance.
          </p>

          {/* Call to Actions */}
          <div className='flex flex-wrap items-center justify-center gap-4 pt-4'>
            <Button asChild size='lg' className='gap-2 px-6 h-12 text-base shadow-lg shadow-primary/20'>
              <Link href={ROUTES.SAAS_ROOT}>
                Access Staff Portal
                <ArrowRight className='h-4 w-4' />
              </Link>
            </Button>

            <Button asChild variant='outline' size='lg' className='h-12 px-6 text-base'>
              <Link href={ROUTES.SIGN_IN}>Sign In to Account</Link>
            </Button>
          </div>

          {/* Quick Demo Credentials Card */}
          <div className='mt-8 max-w-xl mx-auto p-4 rounded-xl bg-card border border-border shadow-sm text-left'>
            <div className='flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-2'>
              <KeyRound className='h-3.5 w-3.5' /> Pre-Seeded Test Credentials (Password: <code>Password123!</code>)
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs'>
              <div className='p-2 rounded-lg bg-muted/50 border border-border/50'>
                <div className='font-semibold text-foreground'>Staff Role</div>
                <div className='text-muted-foreground font-mono text-[11px] truncate'>staff@workshop.com</div>
              </div>
              <div className='p-2 rounded-lg bg-muted/50 border border-border/50'>
                <div className='font-semibold text-foreground'>Manager Role</div>
                <div className='text-muted-foreground font-mono text-[11px] truncate'>manager@workshop.com</div>
              </div>
              <div className='p-2 rounded-lg bg-muted/50 border border-border/50'>
                <div className='font-semibold text-foreground'>Admin Role</div>
                <div className='text-muted-foreground font-mono text-[11px] truncate'>admin@workshop.com</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Guarantees Grid */}
      <section className='py-16 px-6 bg-muted/20 border-y border-border/50'>
        <div className='max-w-7xl mx-auto'>
          <div className='text-center space-y-2 mb-12'>
            <Badge variant='outline' className='text-xs font-mono uppercase tracking-wider'>
              Enterprise Guarantees
            </Badge>
            <h2 className='text-2xl sm:text-3xl font-bold tracking-tight'>
              Architected for Zero Errors Under Heavy Concurrency
            </h2>
            <p className='text-sm text-muted-foreground max-w-xl mx-auto'>
              Engineered to meet all core interview reliability constraints.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {CORE_PILLARS.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <Card key={idx} className='border-border/60 shadow-sm bg-card/60 backdrop-blur-sm hover:border-primary/40 transition-colors'>
                  <CardHeader className='pb-2'>
                    <div className='h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-2'>
                      <Icon className='h-5 w-5' />
                    </div>
                    <CardTitle className='text-base font-semibold'>{pillar.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='text-xs text-muted-foreground leading-relaxed'>{pillar.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Three Training Locations */}
      <section className='py-16 px-6'>
        <div className='max-w-7xl mx-auto space-y-8'>
          <div className='flex flex-col md:flex-row md:items-end justify-between gap-4'>
            <div>
              <Badge variant='outline' className='text-xs font-mono uppercase tracking-wider mb-2'>
                Network Footprint
              </Badge>
              <h2 className='text-2xl sm:text-3xl font-bold tracking-tight'>
                Three Active Training Centres
              </h2>
              <p className='text-sm text-muted-foreground mt-1'>
                Real-time capacity tracking across all three district hubs.
              </p>
            </div>

            <Button asChild variant='outline' size='sm' className='gap-2'>
              <Link href={ROUTES.WORKSHOPS_ROOT}>
                <Calendar className='h-4 w-4' />
                View Workshop Schedule
              </Link>
            </Button>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {LOCATIONS.map((loc, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-2xl border bg-gradient-to-br ${loc.color} shadow-sm space-y-3`}
              >
                <div className='flex items-center justify-between'>
                  <div className='h-8 w-8 rounded-lg bg-background/80 backdrop-blur-sm flex items-center justify-center text-foreground shadow-sm'>
                    <Building2 className='h-4 w-4' />
                  </div>
                  <Badge variant='outline' className='bg-background/80 text-[10px] font-mono'>
                    ACTIVE VENUE
                  </Badge>
                </div>
                <div>
                  <h3 className='font-bold text-lg text-foreground'>{loc.name}</h3>
                  <p className='text-xs text-muted-foreground'>{loc.address}</p>
                </div>
                <div className='pt-2 border-t border-border/40 text-xs font-medium text-foreground/80'>
                  Focus: {loc.capacity}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3-Tier Strict RBAC Matrix */}
      <section className='py-16 px-6 bg-muted/20 border-t border-border/50'>
        <div className='max-w-7xl mx-auto space-y-10'>
          <div className='text-center space-y-2'>
            <Badge variant='outline' className='text-xs font-mono uppercase tracking-wider'>
              Strict Governance
            </Badge>
            <h2 className='text-2xl sm:text-3xl font-bold tracking-tight'>
              Role-Based Access Control Architecture
            </h2>
            <p className='text-sm text-muted-foreground max-w-xl mx-auto'>
              Strict security separation between administrative account provisioning and workshop registration operations.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {SYSTEM_ROLES.map((role, idx) => {
              const Icon = role.icon;
              return (
                <Card key={idx} className='border-border/80 shadow-sm flex flex-col justify-between'>
                  <CardHeader className='pb-3'>
                    <div className='flex items-center justify-between mb-2'>
                      <div className='h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center'>
                        <Icon className='h-5 w-5' />
                      </div>
                      <Badge variant='secondary' className='text-[10px] font-mono font-bold'>
                        {role.badge}
                      </Badge>
                    </div>
                    <CardTitle className='text-lg font-bold'>{role.title}</CardTitle>
                    <CardDescription className='text-xs leading-relaxed mt-1'>
                      {role.desc}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='pt-0'>
                    <div className='space-y-2 pt-3 border-t border-border/60'>
                      <span className='text-[11px] font-semibold text-muted-foreground uppercase tracking-wider'>
                        Capabilities:
                      </span>
                      {role.permissions.map((p, pIdx) => (
                        <div key={pIdx} className='flex items-start gap-2 text-xs text-foreground'>
                          <CheckCircle2 className='h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0' />
                          <span>{p}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className='mt-auto border-t border-border/60 py-10 px-6 bg-card'>
        <div className='max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground'>
          <div className='flex items-center gap-2'>
            <Building2 className='h-4 w-4 text-primary' />
            <span className='font-semibold text-foreground'>Community Training Centre</span>
            <span>• Workshop Registration Service</span>
          </div>

          <div className='flex items-center gap-4'>
            <Link href={ROUTES.SAAS_ROOT} className='hover:text-foreground transition-colors'>
              Portal
            </Link>
            <Link href={ROUTES.WORKSHOPS_ROOT} className='hover:text-foreground transition-colors'>
              Workshops
            </Link>
            <Link href={ROUTES.REGISTRATIONS_ROOT} className='hover:text-foreground transition-colors'>
              Audit Records
            </Link>
            <Link href={ROUTES.SIGN_IN} className='hover:text-foreground transition-colors'>
              Sign In
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
