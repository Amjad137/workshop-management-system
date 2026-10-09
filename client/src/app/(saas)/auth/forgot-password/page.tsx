'use client';

import { useForm } from 'react-hook-form';

import { ROUTES } from '@/constants/routes.constants';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { environment } from '@/config/env.config';
import { useRequestPasswordReset } from '@/hooks/use-auth';
import { toast } from '@/hooks/use-toast';
import { yupResolver } from '@hookform/resolvers/yup';
import Link from 'next/link';
import { useState } from 'react';
import { InferType, object, string } from 'yup';

const forgotPasswordSchema = object({
  email: string().email('Invalid email format.').required('Email is required.'),
});

type FormValues = InferType<typeof forgotPasswordSchema>;

const ForgotPasswordPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const requestPasswordReset = useRequestPasswordReset();

  const form = useForm<FormValues>({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const forgotPasswordFormOnSubmit = form.handleSubmit(async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      const callbackURL = new URL(ROUTES.RESET_PASSWORD, environment.siteURL).toString();
      const response = (await requestPasswordReset.mutateAsync({
        email: values.email,
        redirectTo: callbackURL,
      })) as { message?: string; resetUrl?: string } | null;

      // Show success message
      toast({
        title: 'Reset Link Sent!',
        description:
          response?.message || 'If your account exists, a password reset link will be sent.',
      });

      setIsSuccess(true);

      // In development, show the reset URL
      const resetUrl = response?.resetUrl;
      if (environment.isDebugMode && resetUrl) {
        console.log('Reset URL (Development):', resetUrl);
        // You can also show this in a toast for development
        toast({
          title: 'Development Mode',
          description: `Reset URL: ${resetUrl}`,
        });
      }
    } catch {
      // Error handling is already done in the service
      // Just reset the form state
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  });

  if (isSuccess) {
    return (
      <Card className='min-w-[350px]'>
        <CardHeader className='p-3'>
          <CardTitle className='text-center text-xl font-bold'>Check Your Phone</CardTitle>
        </CardHeader>

        <CardContent className='flex flex-col gap-5'>
          <div className='text-center space-y-3'>
            <p className='text-muted-foreground'>
              If an account with that username exists, we&apos;ve sent a password reset link to your
              mobile number .
            </p>
            <p className='text-sm text-muted-foreground'>
              Please check your mobile number and follow the instructions to reset your password.
            </p>
          </div>

          <div className='space-y-3'>
            <Link href={ROUTES.SIGN_IN}>
              <Button variant='outline' className='w-full'>
                Back to Sign In
              </Button>
            </Link>
            <Button
              variant='ghost'
              className='w-full'
              onClick={() => {
                setIsSuccess(false);
                form.reset();
              }}
            >
              Try Another Username
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='max-w-[350px]'>
      <CardHeader className='p-3'>
        <CardTitle className='text-center text-xl font-bold'>Forgot Password</CardTitle>
      </CardHeader>

      <CardContent className='flex flex-col gap-5'>
        <div className='text-center'>
          <p className='text-xs text-muted-foreground leading-relaxed'>
            Enter your username and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={forgotPasswordFormOnSubmit} className='flex flex-col gap-3 min-w-30'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder='Username' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type='submit' loading={isSubmitting} disabled={isSubmitting}>
              Send Reset Link
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
              Don&apos;t have an account?{' '}
              <Link className='underline' href={ROUTES.SIGN_UP}>
                Sign Up
              </Link>
            </div>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ForgotPasswordPage;
