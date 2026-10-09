'use client';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { UserCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const LoginPopover = () => {
  const router = useRouter();
  return (
    <Popover>
      <PopoverTrigger className='relative'>
        <div className='p-2'>
          <UserCircle size={24} />
        </div>
      </PopoverTrigger>
      <PopoverContent className='absolute top-2 right-0 rounded-2xl w-60 bg-white'>
        <div className='flex flex-col items-center justify-center w-full gap-1'>
          <Button onClick={() => router.push('/auth/sign-in')} className='rounded-3xl w-full'>
            Login
          </Button>
          <Link href={'/auth/sign-up'} className='text-xs text-primary hover:underline'>
            Register
          </Link>
          <hr className='border-[0.5] border-gray-300 w-full my-2' />
          <div className='flex flex-col gap-2 text-primary text-xs w-full justify-start'>
            <Link href={'/portal'} className='hover:underline'>
              Help Center
            </Link>
            <Link href={'/portal'} className='hover:underline'>
              Make a complaint
            </Link>
            <Link href={'/portal'} className='hover:underline'>
              FAQs
            </Link>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LoginPopover;
