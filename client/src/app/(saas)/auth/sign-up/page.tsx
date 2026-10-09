'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';

import {
  getSignupSchema,
  ISignupFormValues,
} from '@/components/saas/auth/sign-up/schema/sign-up.schema';
import SignUpForm from '@/components/saas/auth/sign-up/sign-up-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ROUTES } from '@/constants/routes.constants';
import { S3_FOLDERS } from '@/constants/s3.constants';
import { useSignUp } from '@/hooks/use-auth';
import { toast } from '@/hooks/use-toast';
import { uploadPublicImage } from '@/services/upload.service';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';

const Signup = () => {
  const signUpMutation = useSignUp();
  const router = useRouter();

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

  const signUpFormOnSubmit = async (values: ISignupFormValues) => {
    let uploadedImageKey: string | undefined; // Track uploaded image for cleanup

    try {
      let profilePicUrl: string | undefined;

      // Upload profile picture first if provided
      if (values.profilePicture && values.profilePicture instanceof File) {
        try {
          const uploadResult = await uploadPublicImage(
            values.profilePicture,
            S3_FOLDERS.PROFILE_IMAGES,
          );

          profilePicUrl = uploadResult.url; // Use public URL instead of key
          uploadedImageKey = uploadResult.key; // Store key for potential cleanup
        } catch (uploadError) {
          console.error('Profile picture upload failed:', uploadError);
          toast({
            title: 'Profile Picture Upload Failed',
            description: 'Failed to upload profile picture. Continuing with signup...',
            variant: 'destructive',
          });
          // Continue with signup even if profile picture upload fails
        }
      }

      // Prepare signup data for better-auth
      const { name, phoneNumber, address, ...cleanValues } = values;

      await signUpMutation.mutateAsync({
        email: cleanValues.email,
        password: cleanValues.password ?? '',
        name,
        phoneNumber,
        address,
        image: profilePicUrl,
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
          // Don't show user error for cleanup failure
        }
      }

      // Errors are surfaced by the auth hook
    }
  };

  return (
    <Card className='w-full max-w-3xl mx-auto shadow-lg'>
      <CardHeader className='bg-primary/5 border-b border-border/40'>
        <CardTitle className='text-center text-primary text-2xl font-bold'>
          Create Your Account
        </CardTitle>
      </CardHeader>

      <CardContent className='p-6'>
        <SignUpForm form={form} onSubmit={signUpFormOnSubmit} isSubmitting={isSubmitting} />

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
};

export default Signup;
