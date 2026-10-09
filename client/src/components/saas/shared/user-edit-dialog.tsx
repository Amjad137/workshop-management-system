import {
  getSignupSchema,
  ISignupFormValues,
} from '@/components/saas/auth/sign-up/schema/sign-up.schema';
import SignUpForm from '@/components/saas/auth/sign-up/sign-up-form';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { ERROR_MESSAGES } from '@/constants/error.constants';
import { toast } from '@/hooks/use-toast';
import { useUpdateUser } from '@/hooks/use-users';
import { IUser } from '@/types/user.type';
import ErrorHandler from '@/utils/error-handler';
import { yupResolver } from '@hookform/resolvers/yup';
import { AxiosError } from 'axios';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  userData: IUser;
};

const EditUserDialog = ({ open, setOpen, userData }: Props) => {
  const form = useForm<ISignupFormValues>({
    resolver: yupResolver(getSignupSchema('edit')),
    defaultValues: {
      name: userData.name ?? '',
      phoneNumber: userData.phoneNumber ?? '',
      profilePicture: userData.image ?? '',
      address: userData.address ?? '',
    },
  });

  const { mutateAsync: updateUser, isPending: isLoading } = useUpdateUser();

  const isSubmitting = form.formState.isSubmitting;
  const { setValue } = form;

  const onSubmit = async (values: ISignupFormValues) => {
    let uploadedImageKey: string | undefined; // Track uploaded image for cleanup

    try {
      let imageUrl: string | undefined = userData.image ?? ''; // Keep existing URL by default

      // Upload profile picture first if a new file is provided
      if (values.profilePicture && values.profilePicture instanceof File) {
        try {
          const { uploadPublicImage } = await import('@/services/upload.service');
          const { S3_FOLDERS } = await import('@/constants/s3.constants');
          const { extractS3KeyFromUrl } = await import('@/utils/s3-utils');
          const uploadResult = await uploadPublicImage(
            values.profilePicture,
            S3_FOLDERS.PROFILE_IMAGES,
            extractS3KeyFromUrl(userData.image), // Extract old key for replacement
          );

          imageUrl = uploadResult.url; // Use new public URL
          uploadedImageKey = uploadResult.key; // Store key for potential cleanup
        } catch (uploadError) {
          console.error('Profile picture upload failed:', uploadError);
          toast({
            title: 'Profile Picture Upload Failed',
            description: 'Failed to upload profile picture. Continuing with update...',
            variant: 'destructive',
          });
          // Continue with update even if profile picture upload fails
        }
      }

      // Prepare update data with public URL (exclude profilePicture from values)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { profilePicture, ...cleanValues } = values;
      const updateData = {
        ...cleanValues,
        image: imageUrl,
      };

      await updateUser({ userId: userData.id, userData: updateData });

      // Update form field with new URL after successful upload
      if (imageUrl && imageUrl !== userData.image) {
        setValue('profilePicture', imageUrl);
      }

      toast({
        title: 'User Updated',
        description: 'User updated successfully!',
      });
    } catch (error) {
      // Clean up uploaded image if update failed
      if (uploadedImageKey) {
        try {
          const { deleteS3Files } = await import('@/services/upload.service');
          await deleteS3Files([uploadedImageKey]);
        } catch (cleanupError) {
          console.error('Failed to cleanup uploaded image:', cleanupError);
          // Don't show user error for cleanup failure
        }
      }

      // Show error message
      if (error instanceof AxiosError) {
        const { errorMessage } = ErrorHandler(error);
        toast({
          title: 'Error!',
          description: errorMessage,
          variant: 'destructive',
        });
      } else if (error instanceof Error) {
        toast({
          title: 'Error!',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error!',
          description: ERROR_MESSAGES.UNKNOWN_ERR,
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} modal>
      <DialogContent className='overflow-auto max-h-full max-w-4xl'>
        <DialogTitle>
          <div className='flex flex-col items-center justify-center space-y-2'>
            <AlertCircle className='text-yellow-400' size={40} />
            <h2 className='text-xl font-semibold text-foreground'>Edit User</h2>
          </div>
        </DialogTitle>
        {isLoading ? (
          <div className='flex justify-center items-center py-8'>
            <Loader2 className='h-8 w-8 text-yellow-400 animate-spin' />
          </div>
        ) : (
          <SignUpForm form={form} onSubmit={onSubmit} isSubmitting={isSubmitting} isEditing />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
