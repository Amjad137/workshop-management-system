'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useShallow } from 'zustand/react/shallow';
import { useTableUrlSync } from '@/hooks/use-table-url-sync';
import { useTableStore } from '@/stores/table-store';
import { useGetAllWorkshops } from '@/hooks/use-workshops';
import { useAuthStore } from '@/stores/auth.store';
import { USER_ROLE } from '@/constants/user.constants';
import { API_QUERY_PARAMS, ENTITY_SORT } from '@/constants/common.constants';
import { IWorkshop, WORKSHOP_STATUS } from '@/types/workshop.type';

import { WorkshopCard } from '@/components/saas/workshops/workshop-card';
import { WorkshopDialog } from '@/components/saas/workshops/workshop-dialog';
import { RegisterAttendeeDialog } from '@/components/saas/workshops/register-attendee-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { PaginationWithLinks } from '@/components/ui/data-table/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BookOpen, Search, Plus, Filter, X } from 'lucide-react';

const LOCATIONS = ['ALL', 'Downtown Studio', 'North Campus', 'West End Hub'];
const CATEGORIES = ['ALL', 'Pottery', 'Coding', 'Fitness', 'Art & Craft'];

const WorkshopsPage = () => {
  const searchParams = useSearchParams();
  const { userRole } = useAuthStore();
  const isManager = userRole === USER_ROLE.MANAGER;

  // Initialize URL sync for cards mode
  useTableUrlSync('cards');

  const { filters, setFilters, resetFilters } = useTableStore(
    useShallow((state) => ({
      filters: state.filters,
      setFilters: state.setFilters,
      resetFilters: state.resetFilters,
    })),
  );

  // Modal states
  const [workshopModalOpen, setWorkshopModalOpen] = useState(false);
  const [selectedWorkshopForEdit, setSelectedWorkshopForEdit] = useState<IWorkshop | null>(null);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [selectedWorkshopForRegister, setSelectedWorkshopForRegister] = useState<IWorkshop | null>(
    null,
  );

  // Extract filters from store or fallback to URL searchParams
  const searchKey =
    (filters[API_QUERY_PARAMS.SEARCH_KEY] as string) ||
    searchParams?.get(API_QUERY_PARAMS.SEARCH_KEY) ||
    '';

  const location =
    (filters['location'] as string) ||
    searchParams?.get('location') ||
    'ALL';

  const category =
    (filters['category'] as string) ||
    searchParams?.get('category') ||
    'ALL';

  const status =
    (filters[API_QUERY_PARAMS.STATUS] as string) ||
    searchParams?.get(API_QUERY_PARAMS.STATUS) ||
    'ALL';

  const onlyAvailable =
    filters['has_available_seats'] !== undefined
      ? Boolean(filters['has_available_seats'])
      : searchParams?.get('has_available_seats') === 'true';

  const skip = searchParams?.get(API_QUERY_PARAMS.SKIP)
    ? Number(searchParams.get(API_QUERY_PARAMS.SKIP))
    : 0;
  const limit = searchParams?.get(API_QUERY_PARAMS.LIMIT)
    ? Number(searchParams.get(API_QUERY_PARAMS.LIMIT))
    : 9;

  // Server-side filtered and paginated workshops
  const {
    data: workshops,
    extras,
    isLoading,
    refetch,
  } = useGetAllWorkshops({
    search_key: searchKey.trim() || undefined,
    location: location !== 'ALL' ? location : undefined,
    category: category !== 'ALL' ? category : undefined,
    status: status !== 'ALL' ? (status as WORKSHOP_STATUS) : undefined,
    has_available_seats: onlyAvailable ? true : undefined,
    skip,
    limit,
    sort_by: 'date',
    sort_order: ENTITY_SORT.ASC,
  });

  const handleSearchChange = (value: string) => {
    setFilters(API_QUERY_PARAMS.SEARCH_KEY, value || undefined);
    setFilters(API_QUERY_PARAMS.SKIP, 0);
  };

  const handleLocationChange = (value: string) => {
    setFilters('location', value === 'ALL' ? undefined : value);
    setFilters(API_QUERY_PARAMS.SKIP, 0);
  };

  const handleCategoryChange = (value: string) => {
    setFilters('category', value === 'ALL' ? undefined : value);
    setFilters(API_QUERY_PARAMS.SKIP, 0);
  };

  const handleStatusChange = (value: string) => {
    setFilters(API_QUERY_PARAMS.STATUS, value === 'ALL' ? undefined : value);
    setFilters(API_QUERY_PARAMS.SKIP, 0);
  };

  const handleAvailableToggle = () => {
    const nextVal = !onlyAvailable;
    setFilters('has_available_seats', nextVal ? true : undefined);
    setFilters(API_QUERY_PARAMS.SKIP, 0);
  };

  const totalCount = extras?.total ?? workshops.length;
  const hasActiveFilters = Boolean(
    searchKey ||
    location !== 'ALL' ||
    category !== 'ALL' ||
    status !== 'ALL' ||
    onlyAvailable,
  );

  const handleOpenAdd = () => {
    setSelectedWorkshopForEdit(null);
    setWorkshopModalOpen(true);
  };

  const handleOpenEdit = (ws: IWorkshop) => {
    setSelectedWorkshopForEdit(ws);
    setWorkshopModalOpen(true);
  };

  const handleOpenRegister = (ws: IWorkshop) => {
    setSelectedWorkshopForRegister(ws);
    setRegisterModalOpen(true);
  };

  return (
    <div className='container mx-auto space-y-6 py-4 max-w-7xl px-4'>
      {/* Page Header */}
      <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <div className='flex items-center gap-2.5'>
            <h1 className='text-2xl font-bold tracking-tight text-foreground'>
              Workshops Catalogue
            </h1>
            {!isLoading && (
              <Badge variant='secondary' className='text-xs font-semibold'>
                {totalCount} workshop{totalCount !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          <p className='text-xs sm:text-sm text-muted-foreground mt-1'>
            Browse workshops, manage capacity, and register attendees in real-time across all 3
            locations.
          </p>
        </div>

        {isManager && (
          <Button onClick={handleOpenAdd} className='gap-2 shadow-sm self-start sm:self-auto'>
            <Plus className='h-4 w-4' />
            Schedule Workshop
          </Button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className='flex flex-col lg:flex-row gap-3 p-4 bg-card rounded-xl border border-border shadow-sm'>
        <div className='relative flex-1 min-w-[220px]'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Search workshops by title, code, instructor...'
            value={searchKey}
            onChange={(e) => handleSearchChange(e.target.value)}
            className='pl-9 h-9 text-xs'
          />
        </div>

        <div className='flex flex-wrap items-center gap-2'>
          {/* Location selector */}
          <Select value={location} onValueChange={handleLocationChange}>
            <SelectTrigger className='w-[160px] h-9 text-xs'>
              <SelectValue placeholder='Location' />
            </SelectTrigger>
            <SelectContent>
              {LOCATIONS.map((loc) => (
                <SelectItem key={loc} value={loc} className='text-xs'>
                  {loc === 'ALL' ? 'All Locations' : loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Category selector */}
          <Select value={category} onValueChange={handleCategoryChange}>
            <SelectTrigger className='w-[140px] h-9 text-xs'>
              <SelectValue placeholder='Category' />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat} className='text-xs'>
                  {cat === 'ALL' ? 'All Categories' : cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status selector */}
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className='w-[140px] h-9 text-xs'>
              <SelectValue placeholder='Status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='ALL' className='text-xs'>All Statuses</SelectItem>
              <SelectItem value={WORKSHOP_STATUS.SCHEDULED} className='text-xs'>Scheduled</SelectItem>
              <SelectItem value={WORKSHOP_STATUS.IN_PROGRESS} className='text-xs'>In Progress</SelectItem>
              <SelectItem value={WORKSHOP_STATUS.COMPLETED} className='text-xs'>Completed</SelectItem>
              <SelectItem value={WORKSHOP_STATUS.CANCELLED} className='text-xs'>Cancelled</SelectItem>
            </SelectContent>
          </Select>

          {/* Available Seats Toggle */}
          <Button
            type='button'
            variant={onlyAvailable ? 'default' : 'outline'}
            size='sm'
            onClick={handleAvailableToggle}
            className='gap-1.5 h-9 text-xs'
          >
            <Filter className='h-3.5 w-3.5' />
            Available Seats
          </Button>

          {hasActiveFilters && (
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => {
                resetFilters();
                setFilters(API_QUERY_PARAMS.SKIP, 0);
              }}
              className='h-9 px-2 text-xs text-muted-foreground hover:text-foreground'
            >
              Reset
              <X className='ml-1.5 h-3.5 w-3.5' />
            </Button>
          )}
        </div>
      </div>

      {/* Loading Skeletons */}
      {isLoading ? (
        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className='h-[340px] w-full rounded-xl' />
          ))}
        </div>
      ) : workshops.length === 0 ? (
        searchKey || hasActiveFilters ? (
          <div className='flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed border-border bg-card/50'>
            <div className='size-12 rounded-xl bg-muted/60 flex items-center justify-center mb-3 text-muted-foreground'>
              <Search className='size-6' />
            </div>
            <h3 className='font-semibold text-foreground text-sm'>No matching workshops found</h3>
            <p className='text-xs text-muted-foreground mt-1 max-w-sm'>
              {searchKey
                ? `No workshops match "${searchKey}". Try adjusting your filters.`
                : 'No workshops match the selected criteria.'}
            </p>
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-dashed border-border bg-card/50'>
            <div className='size-14 rounded-2xl bg-muted/60 flex items-center justify-center mb-4 text-muted-foreground'>
              <BookOpen className='size-7' />
            </div>
            <h3 className='text-lg font-semibold text-foreground'>No workshops scheduled yet</h3>
            <p className='text-sm text-muted-foreground mt-1 max-w-sm'>
              There are currently no workshops in the catalogue. Managers can schedule new sessions
              above.
            </p>
          </div>
        )
      ) : (
        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {workshops.map((ws: IWorkshop) => (
            <WorkshopCard
              key={ws._id}
              workshop={ws}
              isManager={isManager}
              onRegister={handleOpenRegister}
              onEdit={handleOpenEdit}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && totalCount > limit && (
        <div className='flex justify-end pt-2'>
          <PaginationWithLinks skip={skip} limit={limit} totalCount={totalCount} isTable={false} />
        </div>
      )}

      {/* Modals */}
      <WorkshopDialog
        workshop={selectedWorkshopForEdit}
        open={workshopModalOpen}
        onOpenChange={setWorkshopModalOpen}
        onSuccess={() => refetch()}
      />

      <RegisterAttendeeDialog
        workshop={selectedWorkshopForRegister}
        open={registerModalOpen}
        onOpenChange={setRegisterModalOpen}
        onSuccess={() => refetch()}
      />
    </div>
  );
};

export default WorkshopsPage;
