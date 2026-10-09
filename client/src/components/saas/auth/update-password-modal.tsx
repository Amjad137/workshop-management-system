'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, string, InferType, ref } from 'yup';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth.store';
import { useUpdatePassword } from '@/hooks/use-auth';
import { passwordStrength } from './sign-up/schema/sign-up.schema';

const passwordSchema = object({
  currentPassword: string().required('Current password is required.'),
  newPassword: passwordStrength.required('Password is required'),
  confirmNewPassword: string()
    .required('Confirm password is required')
    .oneOf([ref('newPassword')], 'Passwords must match'),
});

type PasswordFormValues = InferType<typeof passwordSchema>;

interface UpdatePasswordModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const UpdatePasswordModal = ({ open, setOpen }: UpdatePasswordModalProps) => {
  const { user } = useAuthStore();
  const updatePasswordMutation = useUpdatePassword();

  const form = useForm<PasswordFormValues>({
    resolver: yupResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const loading = updatePasswordMutation.isPending;

  const handleSubmit = async (values: PasswordFormValues) => {
    try {
      await updatePasswordMutation.mutateAsync({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      setOpen(false);
      form.reset();
    } catch {
      // error handled in hook
    }
  };

  const handleCancel = () => {
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Edit Password</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} autoComplete='off' className='space-y-4'>
            <FormField
              control={form.control}
              name='currentPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Current Password</FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      placeholder='Current Password'
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='newPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>New Password</FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      placeholder='New Password'
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='confirmNewPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      placeholder='Confirm Password'
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2'>
              <Button type='button' variant='outline' onClick={handleCancel} disabled={loading}>
                Cancel
              </Button>
              <Button type='submit' disabled={loading} className='min-w-[100px]'>
                {loading ? 'Updating...' : 'Update Password'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdatePasswordModal;
