'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, string, InferType } from 'yup';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { IWorkshop } from '@/types/workshop.type';
import { useRegisterAttendee, useAddToWaitlist } from '@/hooks/use-registrations';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, UserCheck } from 'lucide-react';

const registerAttendeeSchema = object({
  attendeeName: string().required('Attendee full name is required').trim(),
  attendeeEmail: string()
    .email('Please enter a valid email address')
    .required('Attendee email is required')
    .trim()
    .lowercase(),
  notes: string().trim().optional(),
});

type RegisterAttendeeFormValues = InferType<typeof registerAttendeeSchema>;

interface Props {
  workshop: IWorkshop | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function RegisterAttendeeDialog({ workshop, open, onOpenChange, onSuccess }: Props) {
  const { mutateAsync: registerMutation } = useRegisterAttendee();
  const { mutateAsync: waitlistMutation } = useAddToWaitlist();

  const form = useForm<RegisterAttendeeFormValues>({
    resolver: yupResolver(registerAttendeeSchema),
    defaultValues: {
      attendeeName: '',
      attendeeEmail: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        attendeeName: '',
        attendeeEmail: '',
        notes: '',
      });
    }
  }, [open, form]);

  if (!workshop) return null;

  const seatsLeft = workshop.capacity - workshop.activeRegistrationsCount;
  const isFull = seatsLeft <= 0;

  const onSubmit = async (values: RegisterAttendeeFormValues) => {
    try {
      if (isFull) {
        await waitlistMutation({
          workshopId: workshop._id,
          attendeeName: values.attendeeName,
          attendeeEmail: values.attendeeEmail,
          notes: values.notes || undefined,
        });
      } else {
        await registerMutation({
          workshopId: workshop._id,
          attendeeName: values.attendeeName,
          attendeeEmail: values.attendeeEmail,
          notes: values.notes || undefined,
        });
      }

      onOpenChange(false);
      onSuccess();
    } catch {
      // Handled in hook toast
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[460px]'>
        <DialogHeader>
          <div className='flex items-center justify-between pr-4'>
            <DialogTitle>{isFull ? 'Join Workshop Waitlist' : 'Register Attendee'}</DialogTitle>
            <Badge variant={isFull ? 'destructive' : 'secondary'}>
              {workshop.code}
            </Badge>
          </div>
          <DialogDescription>
            {workshop.title} &bull; {workshop.location}
          </DialogDescription>
        </DialogHeader>

        {isFull ? (
          <div className='flex items-center gap-2 p-3 text-sm rounded-lg bg-destructive/10 text-destructive border border-destructive/20'>
            <AlertCircle className='h-4 w-4 shrink-0' />
            <span>
              This workshop is currently at full capacity ({workshop.capacity}/{workshop.capacity}{' '}
              seats). This attendee will be placed on the waitlist.
            </span>
          </div>
        ) : (
          <div className='flex items-center gap-2 p-3 text-sm rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'>
            <UserCheck className='h-4 w-4 shrink-0' />
            <span>
              {seatsLeft} {seatsLeft === 1 ? 'seat' : 'seats'} available out of {workshop.capacity}.
            </span>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 pt-2'>
            <FormField
              control={form.control}
              name='attendeeName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Attendee Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='e.g., Sarah Connor'
                      {...field}
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='attendeeEmail'
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Attendee Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type='email'
                      placeholder='e.g., sarah@example.com'
                      {...field}
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='notes'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Front Desk Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='e.g., Registered over phone; requested front row seat.'
                      rows={2}
                      {...field}
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className='pt-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
                disabled={form.formState.isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                loading={form.formState.isSubmitting}
                disabled={form.formState.isSubmitting}
              >
                {isFull ? 'Add to Waitlist' : 'Confirm Registration'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
