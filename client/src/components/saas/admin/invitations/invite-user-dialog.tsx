'use client';

import { useState } from 'react';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useCreateInvitation } from '@/hooks/use-invitations';
import { USER_ROLE } from '@/constants/user.constants';
import { MailPlus, Send } from 'lucide-react';

const inviteUserSchema = object({
  email: string()
    .email('Invalid email address format')
    .required('Email address is required')
    .trim()
    .lowercase(),
  role: string().required('Role is required'),
});

type InviteUserFormValues = InferType<typeof inviteUserSchema>;

export function InviteUserDialog() {
  const createInviteMutation = useCreateInvitation();
  const [open, setOpen] = useState(false);

  const form = useForm<InviteUserFormValues>({
    resolver: yupResolver(inviteUserSchema),
    defaultValues: {
      email: '',
      role: USER_ROLE.STAFF,
    },
  });

  const onSubmit = async (values: InviteUserFormValues) => {
    try {
      await createInviteMutation.mutateAsync({
        email: values.email.trim().toLowerCase(),
        role: values.role,
      });

      form.reset({
        email: '',
        role: USER_ROLE.STAFF,
      });
      setOpen(false);
    } catch {
      // Handled in hook/service toast
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='gap-2 shadow-sm'>
          <MailPlus className='h-4 w-4' />
          Send Staff Invitation
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[460px]'>
        <DialogHeader>
          <DialogTitle>Invite New Team Member</DialogTitle>
          <DialogDescription>
            Send an onboarding invitation link. The recipient will be guided to set their own password
            securely upon registration.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 pt-2'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Recipient Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type='email'
                      placeholder='e.g., alex@workshop.com'
                      {...field}
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    Invitation link will be valid for 14 days from issue.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='role'
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Assigned Role</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={form.formState.isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select role' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={USER_ROLE.STAFF}>Front Desk Staff</SelectItem>
                      <SelectItem value={USER_ROLE.MANAGER}>Programme Manager</SelectItem>
                      <SelectItem value={USER_ROLE.ADMIN}>Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className='pt-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => setOpen(false)}
                disabled={form.formState.isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                loading={form.formState.isSubmitting}
                disabled={form.formState.isSubmitting}
                className='gap-1.5'
              >
                <Send className='h-3.5 w-3.5' />
                Send Invitation
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
