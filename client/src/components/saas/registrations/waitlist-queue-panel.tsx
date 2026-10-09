'use client';

import { useState } from 'react';
import {
  useGetAllWaitlists,
  usePromoteFromWaitlist,
  useRemoveFromWaitlist,
} from '@/hooks/use-registrations';
import { useGetAllWorkshops } from '@/hooks/use-workshops';
import { IWaitlist, IWaitlistWorkshopInfo } from '@/types/registration.type';
import { formatDateTime } from '@/utils/date-utils';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  ArrowUpCircle,
  Calendar,
  Clock,
  MapPin,
  Search,
  Trash2,
  UserCheck,
  UserPlus,
} from 'lucide-react';
import { RegisterAttendeeDialog } from '../workshops/register-attendee-dialog';
import { IWorkshop } from '@/types/workshop.type';

export default function WaitlistQueuePanel() {
  const [searchKey, setSearchKey] = useState('');
  const [selectedWorkshopId, setSelectedWorkshopId] = useState<string>('all');
  const [dialogWorkshop, setDialogWorkshop] = useState<IWorkshop | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<IWaitlist | null>(null);

  const { data: workshops } = useGetAllWorkshops({ limit: 100 });
  const { data: waitlistItems, isLoading, refetch } = useGetAllWaitlists({
    workshopId: selectedWorkshopId !== 'all' ? selectedWorkshopId : undefined,
    search_key: searchKey.trim() || undefined,
  });

  const promoteMutation = usePromoteFromWaitlist();
  const removeMutation = useRemoveFromWaitlist();

  const handlePromote = async (waitlistId: string) => {
    try {
      await promoteMutation.mutateAsync(waitlistId);
      refetch();
    } catch {
      // Surfaced in mutation hook
    }
  };

  const handleRemove = async (waitlistId: string) => {
    try {
      await removeMutation.mutateAsync(waitlistId);
      refetch();
    } catch {
      // Surfaced in mutation hook
    }
  };

  const fullWorkshops = (workshops || []).filter(
    (ws) => ws.capacity - ws.activeRegistrationsCount <= 0,
  );

  return (
    <div className='space-y-4'>
      {/* Search & Workshop Filter Toolbar */}
      <div className='flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3'>
        <div className='flex flex-1 items-center gap-2 max-w-md'>
          <div className='relative w-full'>
            <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Search by attendee name or email...'
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              className='pl-8 h-9 text-xs'
            />
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <Select value={selectedWorkshopId} onValueChange={setSelectedWorkshopId}>
            <SelectTrigger className='h-9 w-[220px] text-xs'>
              <SelectValue placeholder='Filter by Workshop' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Workshops</SelectItem>
              {(workshops || []).map((ws) => (
                <SelectItem key={ws._id} value={ws._id}>
                  {ws.code} - {ws.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {fullWorkshops.length > 0 && (
            <Button
              size='sm'
              className='h-9 text-xs gap-1.5 shadow-sm'
              onClick={() => {
                const target =
                  fullWorkshops.find((w) => w._id === selectedWorkshopId) || fullWorkshops[0];
                setDialogWorkshop(target);
                setIsDialogOpen(true);
              }}
            >
              <UserPlus className='h-3.5 w-3.5' />
              Join Waitlist
            </Button>
          )}
        </div>
      </div>

      {/* Queue List Table */}
      <Card className='border border-border/70 shadow-sm'>
        <CardHeader className='pb-3 pt-4 px-4 flex flex-row items-center justify-between'>
          <div>
            <CardTitle className='text-base font-bold tracking-tight flex items-center gap-2'>
              <Clock className='h-4 w-4 text-primary' />
              Active Waitlist Queue
            </CardTitle>
            <CardDescription className='text-xs mt-0.5'>
              Ordered chronologically (FIFO). Attendees are prioritized for seat promotions when cancellations occur.
            </CardDescription>
          </div>
          <Badge variant='secondary' className='text-xs font-mono font-bold px-2 py-0.5'>
            {waitlistItems.length} Waiting
          </Badge>
        </CardHeader>

        <CardContent className='p-0'>
          {isLoading ? (
            <div className='py-12 text-center text-xs text-muted-foreground'>
              Loading waitlist queue...
            </div>
          ) : waitlistItems.length === 0 ? (
            <div className='py-12 text-center text-xs text-muted-foreground space-y-2'>
              <Clock className='h-8 w-8 text-muted-foreground/30 mx-auto' />
              <p className='font-medium text-foreground'>No Attendees Currently Waitlisted</p>
              <p className='max-w-md mx-auto text-muted-foreground'>
                Attendees are automatically queued here when attempting to register for workshops that have reached full seating capacity.
              </p>
            </div>
          ) : (
            <div className='divide-y divide-border/60 overflow-x-auto'>
              {waitlistItems.map((item: IWaitlist, index: number) => {
                const workshop =
                  typeof item.workshopId === 'object' && item.workshopId !== null
                    ? (item.workshopId as IWaitlistWorkshopInfo)
                    : null;

                const openSeats = workshop ? workshop.capacity - workshop.activeRegistrationsCount : 0;
                const canPromote = openSeats > 0;

                return (
                  <div
                    key={item._id}
                    className='p-4 hover:bg-muted/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3'
                  >
                    <div className='flex items-start gap-3 min-w-0'>
                      <Badge
                        variant='outline'
                        className='h-7 w-7 rounded-full flex items-center justify-center p-0 text-xs font-bold shrink-0 font-mono border-primary/40 bg-primary/5 text-primary'
                      >
                        #{index + 1}
                      </Badge>

                      <div className='space-y-1 min-w-0'>
                        <div className='flex flex-wrap items-center gap-2'>
                          <span className='font-bold text-sm text-foreground'>
                            {item.attendeeName}
                          </span>
                          <span className='text-xs text-muted-foreground font-mono'>
                            &lt;{item.attendeeEmail}&gt;
                          </span>
                        </div>

                        {workshop && (
                          <div className='flex flex-wrap items-center gap-2 text-xs text-muted-foreground'>
                            <Badge variant='secondary' className='text-[10px] font-mono'>
                              {workshop.code}
                            </Badge>
                            <span className='font-medium text-foreground truncate max-w-xs'>
                              {workshop.title}
                            </span>
                            <span className='flex items-center gap-1 text-[11px]'>
                              <MapPin className='h-3 w-3' />
                              {workshop.location}
                            </span>
                            {canPromote ? (
                              <Badge className='bg-emerald-600/15 text-emerald-700 dark:text-emerald-400 text-[10px] font-semibold'>
                                Seat Open ({openSeats} free)
                              </Badge>
                            ) : (
                              <Badge variant='outline' className='text-[10px] text-muted-foreground'>
                                Full ({workshop.capacity}/{workshop.capacity})
                              </Badge>
                            )}
                          </div>
                        )}

                        <div className='flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground pt-0.5'>
                          <span className='flex items-center gap-1'>
                            <Calendar className='h-3 w-3' />
                            Queued: {formatDateTime(item.registeredAt)}
                          </span>
                          <span>&bull;</span>
                          <span className='flex items-center gap-1'>
                            <UserCheck className='h-3 w-3' />
                            Staff: {item.registeredBy?.name || 'Front Desk'}
                          </span>
                          {item.notes && (
                            <>
                              <span>&bull;</span>
                              <span className='italic truncate max-w-sm'>
                                Note: &quot;{item.notes}&quot;
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className='flex items-center gap-2 shrink-0 self-end sm:self-center'>
                      <Button
                        size='sm'
                        variant={canPromote ? 'default' : 'outline'}
                        className='h-8 text-xs gap-1.5'
                        disabled={promoteMutation.isPending}
                        onClick={() => handlePromote(item._id)}
                      >
                        <ArrowUpCircle className='h-3.5 w-3.5' />
                        {canPromote ? 'Promote to Confirmed' : 'Force Promote'}
                      </Button>

                      <Button
                        size='sm'
                        variant='ghost'
                        className='h-8 w-8 p-0 text-muted-foreground hover:text-destructive'
                        onClick={() => setItemToRemove(item)}
                      >
                        <Trash2 className='h-3.5 w-3.5' />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog for Removal */}
      <Dialog open={!!itemToRemove} onOpenChange={(open) => !open && setItemToRemove(null)}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle>Remove from Waitlist?</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove <strong className='text-foreground'>{itemToRemove?.attendeeName}</strong> ({itemToRemove?.attendeeEmail}) from the waitlist queue?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='gap-2 sm:gap-0'>
            <Button variant='outline' onClick={() => setItemToRemove(null)}>
              Cancel
            </Button>
            <Button
              variant='destructive'
              disabled={removeMutation.isPending}
              onClick={async () => {
                if (itemToRemove) {
                  await handleRemove(itemToRemove._id);
                  setItemToRemove(null);
                }
              }}
            >
              {removeMutation.isPending ? 'Removing...' : 'Remove Attendee'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add to waitlist dialog */}
      {dialogWorkshop && (
        <RegisterAttendeeDialog
          workshop={dialogWorkshop}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSuccess={() => {
            setIsDialogOpen(false);
            refetch();
          }}
        />
      )}
    </div>
  );
}
