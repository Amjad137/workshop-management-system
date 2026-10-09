'use client';

import { useForm } from 'react-hook-form';

import { ROUTES } from '@/constants/routes.constants';

import { passwordStrength } from '@/components/saas/auth/sign-up/schema/sign-up.schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useResetPassword } from '@/hooks/use-auth';
import { toast } from '@/hooks/use-toast';
import { yupResolver } from '@hookform/resolvers/yup';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { InferType, object, ref, string } from 'yup';

const resetPasswordSchema = object({
  newPassword: passwordStrength.required('Password is required'),
  confirmPassword: string()
    .required('Confirm password is required')
    .oneOf([ref('newPassword')], 'Passwords must match'),
});

type FormValues = InferType<typeof resetPasswordSchema>;

const ResetPasswordPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetPassword = useResetPassword();

  const token = searchParams.get('token');

  const form = useForm<FormValues>({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const resetPasswordFormOnSubmit = form.handleSubmit(async (values: FormValues) => {
    if (!token) return;

    try {
      await resetPassword.mutateAsync({
        token,
        newPassword: values.newPassword,
      });

      toast({
        title: 'Password Reset Successfully!',
        description: 'Your password has been reset. Please sign in with your new password.',
      });

      router.push(ROUTES.SIGN_IN);
    } catch {
      // Errors handled in the auth hook
    }
  });

  if (!token) {
    return (
      <Card className='min-w-[350px]'>
        <CardHeader className='p-3'>
          <CardTitle className='text-center text-xl font-bold'>Invalid Reset Link</CardTitle>
        </CardHeader>

        <CardContent className='flex flex-col gap-5'>
          <div className='text-center'>
            <p className='text-muted-foreground'>
              This password reset link is invalid or has expired.
            </p>
            <p className='text-sm text-muted-foreground mt-2'>
              Please request a new password reset link.
            </p>
          </div>

          <Link href={ROUTES.FORGOT_PASSWORD}>
            <Button className='w-full'>Request New Reset Link</Button>
          </Link>

          <Link href={ROUTES.SIGN_IN}>
            <Button variant='outline' className='w-full'>
              Back to Sign In
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='min-w-[350px]'>
      <CardHeader className='p-3'>
        <CardTitle className='text-center text-xl font-bold'>Reset Password</CardTitle>
      </CardHeader>

      <CardContent className='flex flex-col gap-5'>
        <div className='text-center'>
          <p className='text-muted-foreground'>
            Enter your new password below to reset your account password.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={resetPasswordFormOnSubmit} className='flex flex-col gap-3 min-w-30'>
            <FormField
              control={form.control}
              name='newPassword'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder='New Password' type='password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder='Confirm New Password' type='password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type='submit'
              loading={resetPassword.isPending}
              disabled={resetPassword.isPending}
            >
              Reset Password
            </Button>
          </form>

          <div className='text-center space-y-2'>
            <Link
              href={ROUTES.SIGN_IN}
              className='text-sm font-medium text-muted-foreground hover:underline underline-offset-2'
            >
              Back to Sign In
            </Link>
            <div className='text-xs text-muted-foreground'>
              Remember your password?{' '}
              <Link className='underline' href={ROUTES.SIGN_IN}>
                Sign In
              </Link>
            </div>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ResetPasswordPage;
