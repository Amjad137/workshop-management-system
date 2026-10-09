'use client';

import CameraCapture from '@/components/saas/shared/camera-capture';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Camera, Upload, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ISignupFormValues } from './schema/sign-up.schema';

type Props = {
  form: UseFormReturn<ISignupFormValues>;
  isSubmitting?: boolean;
  isEditing?: boolean;
};

const ProfilePictureUpload = ({ form, isSubmitting, isEditing }: Props) => {
  const [preview, setPreview] = useState<string | null>(null);
  const prevObjectUrlRef = useRef<string | null>(null);
  const [cameraUrl, setCameraUrl] = useState<string | undefined>();
  const [resetTrigger, setResetTrigger] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Watch the profile picture field value
  const profilePictureValue = form.watch('profilePicture');

  // Update preview when profile picture value changes
  useEffect(() => {
    // Revoke previous object URL if it was a File-based one
    if (prevObjectUrlRef.current) {
      URL.revokeObjectURL(prevObjectUrlRef.current);
      prevObjectUrlRef.current = null;
    }

    if (typeof profilePictureValue === 'string' && profilePictureValue) {
      setPreview(profilePictureValue);
    } else if (profilePictureValue instanceof File) {
      const url = URL.createObjectURL(profilePictureValue);
      prevObjectUrlRef.current = url;
      setPreview(url);
    } else {
      setPreview(null);
    }
  }, [profilePictureValue]);

  // Handle camera capture
  useEffect(() => {
    if (cameraUrl) {
      fetch(cameraUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], 'profile-picture.jpg', { type: 'image/jpeg' });
          form.setValue('profilePicture', file);
        })
        .catch((error) => {
          console.error('Error processing camera image:', error);
          form.setError('profilePicture', {
            message: 'Failed to process camera image. Please try again.',
          });
        });
    }
  }, [cameraUrl, form]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      form.setError('profilePicture', {
        message: 'Please select a valid image file (JPEG, PNG, or WebP)',
      });
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      form.setError('profilePicture', {
        message: 'File size must be less than 5MB',
      });
      return;
    }

    // Clear any previous errors and set the file
    form.clearErrors('profilePicture');
    form.setValue('profilePicture', file);
  };

  const removePhoto = () => {
    form.setValue('profilePicture', undefined);
    setCameraUrl(undefined);
    setResetTrigger((prev) => prev + 1);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const name = form.watch('name') || '';
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase();

  return (
    <div className='space-y-4'>
      <FormField
        control={form.control}
        name='profilePicture'
        render={() => (
          <FormItem>
            <FormLabel>Profile Picture (Optional)</FormLabel>
            <FormControl>
              <div className='flex flex-col items-center space-y-4'>
                {/* Avatar Preview */}
                <Avatar className='w-24 h-24'>
                  <AvatarImage
                    src={preview ?? undefined}
                    alt='Profile Picture'
                    className='object-cover'
                  />
                  <AvatarFallback className='text-lg font-medium'>
                    {initials || 'PP'}
                  </AvatarFallback>
                </Avatar>

                {/* Upload Controls */}
                <div className='flex gap-2'>
                  {/* File Upload Button */}
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isSubmitting}
                  >
                    <Upload className='w-4 h-4 mr-2' />
                    Upload Photo
                  </Button>

                  {/* Camera Button with Dialog */}
                  {typeof navigator !== 'undefined' && navigator.mediaDevices && (
                    <CameraCapture setUrl={setCameraUrl} resetTrigger={resetTrigger}>
                      <Button type='button' variant='outline' size='sm' disabled={isSubmitting}>
                        <Camera className='w-4 h-4 mr-2' />
                        Take Photo
                      </Button>
                    </CameraCapture>
                  )}

                  {/* Remove Button - Show if there's a picture */}
                  {preview && (
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={removePhoto}
                      disabled={isSubmitting}
                    >
                      <X className='w-4 h-4 mr-2' />
                      {isEditing ? 'Reset' : 'Remove'}
                    </Button>
                  )}
                </div>

                {/* Hidden File Input */}
                <Input
                  ref={fileInputRef}
                  type='file'
                  accept='image/jpeg,image/jpg,image/png,image/webp'
                  onChange={handleFileUpload}
                  className='hidden'
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ProfilePictureUpload;
