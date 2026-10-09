import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';

import ProfilePictureUpload from '@/components/saas/auth/sign-up/profile-picture-upload';
import { PhoneInput } from '@/components/ui/phone-input';
import { ISignupFormValues } from './schema/sign-up.schema';

type Props = {
  form: UseFormReturn<ISignupFormValues>;
  onSubmit: (data: ISignupFormValues) => void;
  isSubmitting: boolean;
  isEditing?: boolean;
  initialData?: ISignupFormValues;
};

const SignUpForm = ({ form, onSubmit, isSubmitting, isEditing }: Props) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        {/* Personal Information Section */}
        <div className='space-y-4'>
          <h3 className='text-lg font-medium'>Personal Information</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder='ex: Dale Philip' {...field} />
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
                  <FormLabel required>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='johndoe@example.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='phoneNumber'
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Phone Number</FormLabel>
                  <FormControl>
                    <PhoneInput
                      disabled={isSubmitting}
                      defaultCountry='LK'
                      placeholder='Enter a Contact Number'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Profile Picture Section */}
        <div className='space-y-4'>
          <h3 className='text-lg font-medium'>Profile Picture</h3>
          <ProfilePictureUpload form={form} isSubmitting={isSubmitting} isEditing={isEditing} />
        </div>

        {/* Address Section */}
        <div className='space-y-4'>
          <h3 className='text-lg font-medium'>Address Information</h3>
          <div className='grid grid-cols-1 gap-4'>
            <FormField
              control={form.control}
              name='address'
              render={({ field }) => (
                <FormItem className='col-span-full'>
                  <FormLabel required>Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='16, Hapugedara Lane, Colombo'
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        {/* Role based details */}

        {/* Security Section */}
        {!isEditing && (
          <div className='space-y-4'>
            <h3 className='text-lg font-medium'>Account Security</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Password</FormLabel>
                    <FormControl>
                      <Input type='password' placeholder='Password@123' {...field} />
                    </FormControl>
                    <FormDescription>
                      Must include uppercase, lowercase, number and special character
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type='password' placeholder='Password@123' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}
        <div className='pt-4'>
          <Button
            type='submit'
            className='w-full'
            loading={form.formState.isSubmitting}
            disabled={form.formState.isSubmitting}
          >
            {isEditing ? 'Update Profile' : 'Create Account'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SignUpForm;
