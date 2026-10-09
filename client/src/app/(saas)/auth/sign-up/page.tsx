'use client';

import { Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  getSignupSchema,
  ISignupFormValues,
} from '@/components/saas/auth/sign-up/schema/sign-up.schema';
import SignUpForm from '@/components/saas/auth/sign-up/sign-up-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/constants/routes.constants';
import { S3_FOLDERS } from '@/constants/s3.constants';
import { useSignUp } from '@/hooks/use-auth';
import { useValidateInvitationCode } from '@/hooks/use-invitations';
import { toast } from '@/hooks/use-toast';
import { uploadPublicImage } from '@/services/upload.service';
import { AlertTriangle, Loader2, MailX, ShieldAlert } from 'lucide-react';
import PageLoader from '@/components/saas/shared/page-loader';

function SignUpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const signUpMutation = useSignUp();

  const code =
    searchParams.get('code') ||
    searchParams.get('invitationCode') ||
    searchParams.get('invite') ||
    '';

  const {
    data: invitation,
    isLoading,
    isError,
    error,
  } = useValidateInvitationCode(code);

  const form = useForm<ISignupFormValues>({
    resolver: yupResolver(getSignupSchema('create')),
    defaultValues: {
      name: '',
      address: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  // Pre-fill email from invitation once validated
  useEffect(() => {
    if (invitation?.email) {
      form.setValue('email', invitation.email);
    }
  }, [invitation, form]);

  const signUpFormOnSubmit = async (values: ISignupFormValues) => {
    if (!invitation) return;

    let uploadedImageKey: string | undefined;

    try {
      let profilePicUrl: string | undefined;

      // Upload profile picture first if provided
      if (values.profilePicture && values.profilePicture instanceof File) {
        try {
          const uploadResult = await uploadPublicImage(
            values.profilePicture,
            S3_FOLDERS.PROFILE_IMAGES,
          );
          profilePicUrl = uploadResult.url;
          uploadedImageKey = uploadResult.key;
        } catch (uploadError) {
          console.error('Profile picture upload failed:', uploadError);
          toast({
            title: 'Profile Picture Upload Failed',
            description: 'Failed to upload profile picture. Continuing with signup...',
            variant: 'destructive',
          });
        }
      }

      const { name, phoneNumber, address, ...cleanValues } = values;

      await signUpMutation.mutateAsync({
        email: invitation.email,
        password: cleanValues.password ?? '',
        name,
        phoneNumber,
        address,
        image: profilePicUrl,
        invitationCode: invitation.invitationCode,
      });

      router.push(ROUTES.SAAS_ROOT);
    } catch {
      // Clean up uploaded image if signup failed
      if (uploadedImageKey) {
        try {
          const { deleteS3Files } = await import('@/services/upload.service');
          await deleteS3Files([uploadedImageKey]);
        } catch (cleanupError) {
          console.error('Failed to cleanup uploaded image:', cleanupError);
        }
      }
    }
  };

  // State 1: No invitation code provided
  if (!code) {
    return (
      <Card className='w-full max-w-lg mx-auto shadow-lg border-destructive/20'>
        <CardHeader className='text-center space-y-3 pb-4'>
          <div className='mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive'>
            <MailX className='h-7 w-7' />
          </div>
          <CardTitle className='text-2xl font-bold tracking-tight text-foreground'>
            Invitation Required
          </CardTitle>
          <CardDescription className='text-sm text-muted-foreground'>
            Staff registration is strictly by invitation only. You need a valid invitation link from an administrator to create an account.
          </CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col gap-4 pt-2'>
          <div className='rounded-md border border-border/60 bg-muted/50 p-4 text-xs text-muted-foreground space-y-1.5'>
            <p className='font-semibold text-foreground flex items-center gap-1.5'>
              <ShieldAlert className='h-4 w-4 text-amber-500' />
              Received an invitation?
            </p>
            <p>
              Please use the direct link provided in your invitation email, or contact your organization administrator to request an invitation.
            </p>
          </div>

          <div className='flex flex-col gap-2 pt-2'>
            <Button asChild className='w-full shadow-sm'>
              <Link href={ROUTES.SIGN_IN}>Sign In to Existing Account</Link>
            </Button>
            <Button asChild variant='outline' className='w-full'>
              <Link href={ROUTES.MARKETING_ROOT}>Return to Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // State 2: Validating invitation code
  if (isLoading) {
    return (
      <Card className='w-full max-w-lg mx-auto shadow-lg'>
        <CardContent className='flex flex-col items-center justify-center py-16 gap-4'>
          <Loader2 className='h-8 w-8 animate-spin text-primary' />
          <div className='text-center space-y-1'>
            <p className='font-semibold text-foreground text-base'>Verifying Invitation</p>
            <p className='text-xs text-muted-foreground'>
              Please wait while we validate your invitation code...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // State 3: Invalid or expired invitation code
  if (isError || !invitation) {
    return (
      <Card className='w-full max-w-lg mx-auto shadow-lg border-destructive/20'>
        <CardHeader className='text-center space-y-3 pb-4'>
          <div className='mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive'>
            <AlertTriangle className='h-7 w-7' />
          </div>
          <CardTitle className='text-2xl font-bold tracking-tight text-foreground'>
            Invalid or Expired Invitation
          </CardTitle>
          <CardDescription className='text-sm text-muted-foreground'>
            {error instanceof Error
              ? error.message
              : 'This invitation code is invalid, has expired, or has already been used.'}
          </CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col gap-4 pt-2'>
          <div className='rounded-md border border-border/60 bg-muted/50 p-3 text-xs text-muted-foreground flex items-center justify-between'>
            <span>Invitation Code:</span>
            <code className='rounded bg-muted px-2 py-0.5 font-mono font-semibold text-foreground'>
              {code}
            </code>
          </div>

          <p className='text-xs text-muted-foreground text-center'>
            Please request a new invitation from your administrator to create your account.
          </p>

          <div className='flex flex-col gap-2 pt-2'>
            <Button asChild className='w-full shadow-sm'>
              <Link href={ROUTES.SIGN_IN}>Sign In to Existing Account</Link>
            </Button>
            <Button asChild variant='outline' className='w-full'>
              <Link href={ROUTES.MARKETING_ROOT}>Return to Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // State 4: Valid invitation - render signup form
  return (
    <Card className='w-full max-w-3xl mx-auto shadow-lg'>
      <CardHeader className='bg-primary/5 border-b border-border/40'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
          <div>
            <CardTitle className='text-primary text-2xl font-bold'>
              Create Your Account
            </CardTitle>
            <CardDescription className='text-xs text-muted-foreground mt-1'>
              Complete your profile to activate your staff account
            </CardDescription>
          </div>
          <div className='flex items-center gap-2'>
            <Badge
              variant='secondary'
              className='capitalize text-xs font-medium border border-primary/20 bg-primary/10 text-primary'
            >
              Role: {invitation.role}
            </Badge>
            <Badge variant='outline' className='text-xs text-muted-foreground'>
              Code: {invitation.invitationCode}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className='p-6'>
        <div className='mb-6 rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-foreground/90 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <span className='font-medium'>Invited Email:</span>
            <code className='font-mono font-semibold text-primary'>{invitation.email}</code>
          </div>
          <span className='text-[11px] text-muted-foreground'>Verified Invitation</span>
        </div>

        <SignUpForm
          form={form}
          onSubmit={signUpFormOnSubmit}
          isSubmitting={isSubmitting}
          readOnlyEmail={true}
        />

        <div className='mt-6 text-center'>
          <p className='text-sm'>
            Already have an account?{' '}
            <Link className='text-primary font-medium hover:underline' href={ROUTES.SIGN_IN}>
              Sign In
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Signup() {
  return (
    <Suspense fallback={<PageLoader />}>
      <SignUpContent />
    </Suspense>
  );
}
