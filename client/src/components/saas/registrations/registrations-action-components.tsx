'use client';

import { Table } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { IRegistration } from '@/types/registration.type';
import { ROUTES } from '@/constants/routes.constants';
import Link from 'next/link';
import { Calendar } from 'lucide-react';

interface Props<TData> {
  table: Table<TData>;
}

export default function RegistrationsActionComponents<TData>({ table }: Props<TData>) {
  const selectedCount = table.getSelectedRowModel().rows.length;

  return (
    <div className='flex items-center gap-3'>
      {selectedCount > 0 && (
        <span className='text-xs text-muted-foreground font-mono'>
          {selectedCount} item{selectedCount > 1 ? 's' : ''} selected
        </span>
      )}

      <Button asChild variant='outline' size='sm' className='gap-2 shadow-sm'>
        <Link href={ROUTES.WORKSHOPS_ROOT}>
          <Calendar className='h-4 w-4' />
          Browse Workshops
        </Link>
      </Button>
    </div>
  );
}
