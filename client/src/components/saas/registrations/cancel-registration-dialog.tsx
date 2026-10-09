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
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { IRegistration } from '@/types/registration.type';
import { useCancelRegistration } from '@/hooks/use-registrations';
import { AlertTriangle } from 'lucide-react';

const cancelRegistrationSchema = object({
  cancellationReason: string().trim().optional(),
});

type CancelRegistrationFormValues = InferType<typeof cancelRegistrationSchema>;

interface Props {
  registration: IRegistration | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CancelRegistrationDialog({
  registration,
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  const cancelMutation = useCancelRegistration();
  const form = useForm<CancelRegistrationFormValues>({
    resolver: yupResolver(cancelRegistrationSchema),
    defaultValues: {
      cancellationReason: '',
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        cancellationReason: '',
      });
    }
  }, [open, form]);

  if (!registration) return null;

  const onSubmit = async (values: CancelRegistrationFormValues) => {
    try {
      await cancelMutation.mutateAsync({
        id: registration._id,
        payload: {
          cancellationReason: values.cancellationReason || undefined,
        },
      });
      onOpenChange(false);
      onSuccess();
    } catch {
      // Handled in toast
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[440px]'>
        <DialogHeader>
          <div className='flex items-center gap-2 text-destructive'>
            <AlertTriangle className='h-5 w-5' />
            <DialogTitle>Cancel Attendee Registration</DialogTitle>
          </div>
          <DialogDescription>
            Are you sure you want to cancel the registration for{' '}
            <strong className='text-foreground'>{registration.attendeeName}</strong> (
            {registration.attendeeEmail})?
          </DialogDescription>
        </DialogHeader>

        <div className='text-xs text-muted-foreground p-3 rounded-lg bg-muted/60 border border-border'>
          ℹ️ <strong>Capacity Rule:</strong> Cancelling immediately frees 1 seat for this workshop.
          The record will not be deleted; a full historical trail with your name and timestamp is
          preserved.
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 pt-1'>
            <FormField
              control={form.control}
              name='cancellationReason'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for Cancellation (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='e.g., Attendee called to reschedule, sick leave, refund requested...'
                      rows={3}
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
                Keep Registration
              </Button>
              <Button
                type='submit'
                variant='destructive'
                loading={form.formState.isSubmitting}
                disabled={form.formState.isSubmitting}
              >
                Confirm Cancellation
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
