'use client';

import { IWorkshop, WORKSHOP_STATUS } from '@/types/workshop.type';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Calendar, MapPin, User, Plus, History, Pencil } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes.constants';

interface WorkshopCardProps {
  workshop: IWorkshop;
  isManager?: boolean;
  onRegister: (ws: IWorkshop) => void;
  onEdit: (ws: IWorkshop) => void;
}

export const WorkshopCard = ({
  workshop: ws,
  isManager = false,
  onRegister,
  onEdit,
}: WorkshopCardProps) => {
  const seatsRemaining = ws.capacity - ws.activeRegistrationsCount;
  const isFull = seatsRemaining <= 0;
  const percentage = Math.min(100, Math.round((ws.activeRegistrationsCount / ws.capacity) * 100));

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <Card className='flex flex-col justify-between overflow-hidden hover:shadow-md transition-shadow border-border bg-card'>
      <div>
        <CardHeader className='pb-3 pt-5 px-5'>
          <div className='flex items-start justify-between gap-2'>
            <Badge variant='outline' className='font-mono text-xs font-bold'>
              {ws.code}
            </Badge>
            <Badge
              variant={
                ws.status === WORKSHOP_STATUS.CANCELLED
                  ? 'destructive'
                  : isFull
                  ? 'destructive'
                  : 'secondary'
              }
            >
              {ws.status === WORKSHOP_STATUS.CANCELLED
                ? 'Cancelled'
                : isFull
                ? 'Full Capacity'
                : `${seatsRemaining} seats left`}
            </Badge>
          </div>

          <CardTitle className='text-lg font-semibold mt-2 line-clamp-1'>
            {ws.title}
          </CardTitle>
          <p className='text-xs text-muted-foreground line-clamp-2 mt-1'>
            {ws.description || 'No description provided.'}
          </p>
        </CardHeader>

        <CardContent className='space-y-3 px-5 pb-3 text-sm'>
          <div className='flex items-center gap-2 text-muted-foreground'>
            <Calendar className='h-4 w-4 shrink-0 text-primary' />
            <span className='text-xs font-medium text-foreground'>{formatDate(ws.date)}</span>
          </div>

          <div className='flex items-center gap-2 text-muted-foreground'>
            <MapPin className='h-4 w-4 shrink-0 text-primary' />
            <span className='text-xs'>{ws.location}</span>
          </div>

          <div className='flex items-center gap-2 text-muted-foreground'>
            <User className='h-4 w-4 shrink-0 text-primary' />
            <span className='text-xs'>{ws.instructor}</span>
          </div>

          {/* Capacity Utilization Progress Bar */}
          <div className='pt-2 space-y-1.5'>
            <div className='flex justify-between text-xs font-medium'>
              <span>Seats Booked</span>
              <span className={isFull ? 'text-destructive font-bold' : 'text-foreground'}>
                {ws.activeRegistrationsCount} / {ws.capacity} ({percentage}%)
              </span>
            </div>
            <Progress
              value={percentage}
              className={isFull ? '[&>div]:bg-destructive' : '[&>div]:bg-primary'}
            />
          </div>
        </CardContent>
      </div>

      {/* Card Action Buttons */}
      <div className='p-4 pt-2 border-t border-border flex items-center justify-between gap-2 bg-muted/20'>
        <Button
          size='sm'
          onClick={() => onRegister(ws)}
          disabled={ws.status === WORKSHOP_STATUS.CANCELLED}
          className={`flex-1 gap-1.5 ${isFull ? 'bg-amber-600 hover:bg-amber-700 text-white' : ''}`}
        >
          <Plus className='h-3.5 w-3.5' />
          {isFull ? 'Waitlist' : 'Register Attendee'}
        </Button>

        <Button asChild size='sm' variant='outline' title='View Registration History'>
          <Link href={`${ROUTES.REGISTRATIONS_ROOT}?workshopId=${ws._id}`}>
            <History className='h-3.5 w-3.5' />
          </Link>
        </Button>

        {isManager && (
          <Button
            size='sm'
            variant='ghost'
            onClick={() => onEdit(ws)}
            title='Edit Workshop'
          >
            <Pencil className='h-3.5 w-3.5' />
          </Button>
        )}
      </div>
    </Card>
  );
};
