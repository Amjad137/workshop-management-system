'use client';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { UserCircle } from 'lucide-react';
import Link from 'next/link';

const UserPopover = () => {
  return (
    <Popover>
      <PopoverTrigger className='relative'>
        <div className='p-2'>
          <UserCircle size={24} />
        </div>
      </PopoverTrigger>
      <PopoverContent className='absolute top-2 right-0 rounded-2xl w-60 bg-white'>
        <div className='flex flex-col items-center justify-center w-full gap-1'>
          <div className='flex flex-row w-full gap-3'>
            <circle className='w-16 h-16 rounded-full bg-secondary' />
            <div className='flex flex-col justify-start items-center'>
              <span className='text-primary text-g-xs'>
                Welcome Back,
                <br />
                Natasha
              </span>
              <div className='flex w-full justify-start'>
                <Button variant='link' className='text-secondary-foreground h-4 justify-start p-0'>
                  Signout
                </Button>
              </div>
            </div>
          </div>
          <hr className='border-[0.5] border-gray-300 w-full my-2' />
          <div className='flex flex-col gap-2 text-primary text-xs w-full justify-start'>
            <Link href={'/'} className='hover:underline'>
              My Orders
            </Link>
            <Link href={'/'} className='hover:underline'>
              Messages
            </Link>
            <Link href={'/'} className='hover:underline'>
              Payments
            </Link>
            <Link href={'/'} className='hover:underline'>
              Favourites
            </Link>
            <Link href={'/'} className='hover:underline'>
              Edit Profile
            </Link>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default UserPopover;
