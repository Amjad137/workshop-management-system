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
import { useCreateUserAccount } from '@/hooks/use-users';
import { USER_ROLE } from '@/constants/user.constants';
import { UserPlus } from 'lucide-react';

const createUserSchema = object({
  name: string().required('Full name is required').trim(),
  email: string()
    .email('Invalid email address format')
    .required('Email address is required')
    .trim()
    .lowercase(),
  role: string().required('Role is required'),
  phoneNumber: string().trim().optional(),
  password: string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

type CreateUserFormValues = InferType<typeof createUserSchema>;

export function CreateUserDialog() {
  const createUserMutation = useCreateUserAccount();
  const [open, setOpen] = useState(false);

  const form = useForm<CreateUserFormValues>({
    resolver: yupResolver(createUserSchema),
    defaultValues: {
      name: '',
      email: '',
      role: USER_ROLE.STAFF,
      phoneNumber: '',
      password: '',
    },
  });

  const onSubmit = async (values: CreateUserFormValues) => {
    try {
      await createUserMutation.mutateAsync({
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
        phoneNumber: values.phoneNumber?.trim() || undefined,
        role: values.role,
      });

      form.reset({
        name: '',
        email: '',
        role: USER_ROLE.STAFF,
        phoneNumber: '',
        password: 'Password123!',
      });
      setOpen(false);
    } catch {
      // Handled in service/hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='gap-2 shadow-sm'>
          <UserPlus className='h-4 w-4' />
          Add Staff Account
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[460px]'>
        <DialogHeader>
          <DialogTitle>Create Staff Account</DialogTitle>
          <DialogDescription>
            Admin provisioned account creation. Newly created staff can sign in immediately.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 pt-2'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='e.g., Jane Doe'
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
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type='email'
                      placeholder='e.g., jane@workshop.com'
                      {...field}
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-2 gap-3'>
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

              <FormField
                control={form.control}
                name='phoneNumber'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='+1555...'
                        {...field}
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Initial Password</FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      {...field}
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    Default temp password: <code>Password123!</code> (min 8 chars)
                  </FormDescription>
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
              >
                Create Account
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
