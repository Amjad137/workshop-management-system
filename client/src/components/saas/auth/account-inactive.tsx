'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card';
import { USER_ROLE } from '@/constants/user.constants';

import { useSignOut } from '@/hooks/use-auth';
import { authClient } from '@/config/better-auth/auth.client';
import { useAuthStore } from '@/stores/auth.store';
import { Clock, Info, Phone, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
export const AccountInactive = () => {
  const { user, setUser, setUserRole, setIsAuthenticated } = useAuthStore();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(false);
  const signOut = useSignOut();

  const handleSignOut = async () => {
    try {
      await signOut.mutateAsync();
    } catch (error) {
      console.error('Error signing out:', error);
      window.location.href = '/auth/sign-in';
    }
  };

  const handleCheckStatus = async () => {
    try {
      setIsChecking(true);
      const { data: session } = await authClient.getSession();
      const sessionUser = session?.user ?? null;
      if (sessionUser) {
        setUser(sessionUser);
        setUserRole(sessionUser.role as USER_ROLE);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setUserRole(null);
        setIsAuthenticated(false);
      }

      if (sessionUser && !sessionUser.banned) {
        // User is now active, redirect to home
        router.push('/portal');
      }
    } catch (error) {
      console.error('Error checking account status:', error);
      // If API call fails, fallback to page reload
      window.location.reload();
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <Card className='shadow-lg border-gray-200'>
          <CardHeader className='text-center'>
            <div className='mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4'>
              <Clock className='h-8 w-8 text-gray-600' />
            </div>
            <h2 className='text-2xl font-bold text-gray-900'>Account Inactive</h2>
            <CardDescription className='text-center text-gray-600'>
              Your account is currently inactive
            </CardDescription>
          </CardHeader>

          <CardContent className='space-y-4'>
            {user && (
              <div className='bg-gray-50 rounded-lg p-4 space-y-2 border border-gray-200'>
                <div className='flex items-center space-x-2 text-sm text-gray-600'>
                  <User className='h-4 w-4' />
                  <span className='font-medium'>Account:</span>
                  <span>{user.name ?? user.email}</span>
                </div>
              </div>
            )}

            <div className='text-sm text-gray-700 space-y-2'>
              <p className='font-medium'>Your account may be inactive due to:</p>
              <ul className='list-disc list-inside space-y-1 ml-4'>
                <li>End of academic term or graduation</li>
                <li>Extended period of inactivity</li>
                <li>Administrative policy changes</li>
                <li>Account maintenance or updates</li>
              </ul>
            </div>

            <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
              <div className='flex items-start space-x-3'>
                <Info className='h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0' />
                <div className='text-sm'>
                  <p className='font-medium text-blue-900'>Reactivate your account</p>
                  <p className='text-blue-700 mt-1'>
                    Contact the system administrator to request account reactivation if you believe
                    this is an error.
                  </p>
                </div>
              </div>
            </div>

            <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
              <div className='flex items-start space-x-3'>
                <Phone className='h-5 w-5 text-green-600 mt-0.5 flex-shrink-0' />
                <div className='text-sm'>
                  <p className='font-medium text-green-900'>Contact administration</p>
                  <p className='text-green-700 mt-1'>
                    Reach out to the school administration office during business hours for account
                    assistance.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className='flex flex-col sm:flex-row gap-3'>
            <Button variant='outline' onClick={handleSignOut} className='w-full sm:w-auto'>
              Sign Out
            </Button>
            <Button
              variant='secondary'
              onClick={handleCheckStatus}
              disabled={isChecking}
              className='w-full sm:w-auto'
            >
              {isChecking ? 'Checking...' : 'Check Status'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
