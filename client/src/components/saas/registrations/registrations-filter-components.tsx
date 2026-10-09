'use client';

import { TableSearchFilter } from '@/components/ui/data-table/table-search-filter';
import { SelectFilter } from '@/components/ui/data-table/table-filter-select';
import { API_QUERY_PARAMS } from '@/constants/common.constants';
import { REGISTRATION_STATUS } from '@/types/registration.type';
import { useGetAllWorkshops } from '@/hooks/use-workshops';
import { Filter, Calendar } from 'lucide-react';

export default function RegistrationsFilterComponents() {
  const { data: workshops } = useGetAllWorkshops({ limit: 100 });

  const statusOptions = [
    { label: 'Active Only', value: REGISTRATION_STATUS.REGISTERED },
    { label: 'Cancelled Only', value: REGISTRATION_STATUS.CANCELLED },
  ];

  const workshopOptions = (workshops || []).map((w) => ({
    label: `${w.code} - ${w.title}`,
    value: w._id,
  }));

  return (
    <div className='flex flex-wrap items-center gap-3'>
      <TableSearchFilter
        placeholder='Search attendee name, email...'
        paramKey={API_QUERY_PARAMS.SEARCH_KEY}
        className='w-64'
      />

      <SelectFilter
        options={statusOptions}
        paramKey={API_QUERY_PARAMS.STATUS}
        placeholder='Filter by status'
        icon={<Filter className='h-4 w-4' />}
        className='min-w-44'
      />

      <SelectFilter
        options={workshopOptions}
        paramKey='workshopId'
        placeholder='Filter by workshop'
        icon={<Calendar className='h-4 w-4' />}
        className='min-w-56'
      />
    </div>
  );
}
