'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTableStore } from '@/stores/table-store';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { type ReactNode, useCallback, useTransition } from 'react';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from '@/components/ui/pagination-elements';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { API_QUERY_PARAMS } from '@/constants/common.constants';
import { useShallow } from 'zustand/react/shallow';

export interface PaginationWithLinksProps {
  pageSizeSelectOptions?: {
    pageSizeOptions: number[];
  };
  totalCount: number;
  limit: number;
  skip: number;
  isTable?: boolean;
}

export const PaginationWithLinks = ({
  pageSizeSelectOptions,
  limit = 10,
  totalCount = 0,
  skip = 0,
  isTable = false,
}: PaginationWithLinksProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Always call hooks unconditionally
  const { setFilters } = useTableStore(useShallow((state) => ({ setFilters: state.setFilters })));

  // Calculate current page from skip and limit
  const currentPage = Math.floor(skip / limit) + 1;
  const totalPageCount = Math.ceil(totalCount / limit);

  const updatePage = useCallback(
    (newPage: number) => {
      startTransition(() => {
        // Calculate new skip value based on page number
        const newSkip = (newPage - 1) * limit;

        if (isTable) {
          setFilters(API_QUERY_PARAMS.SKIP, newSkip);
        } else {
          // Regular URL update for non-table pagination
          const newSearchParams = new URLSearchParams(searchParams?.toString() || '');
          newSearchParams.set(API_QUERY_PARAMS.SKIP, String(newSkip));

          router.replace(`${pathname}?${newSearchParams.toString()}`, {
            scroll: false,
          });
        }
      });
    },
    [searchParams, pathname, limit, router, isTable, setFilters],
  );

  const updateLimit = useCallback(
    (newLimit: number) => {
      startTransition(() => {
        if (isTable) {
          setFilters(API_QUERY_PARAMS.LIMIT, newLimit);
          setFilters(API_QUERY_PARAMS.SKIP, 0);
        } else {
          // Regular URL update for non-table pagination
          const newSearchParams = new URLSearchParams(searchParams?.toString() || '');
          newSearchParams.set(API_QUERY_PARAMS.LIMIT, String(newLimit));
          newSearchParams.set(API_QUERY_PARAMS.SKIP, '0');

          router.replace(`${pathname}?${newSearchParams.toString()}`, {
            scroll: false,
          });
        }
      });
    },
    [searchParams, pathname, router, isTable, setFilters],
  );

  const renderPageNumbers = () => {
    const items: ReactNode[] = [];
    const maxVisiblePages = 5;

    if (totalPageCount <= maxVisiblePages) {
      for (let i = 1; i <= totalPageCount; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationButton
              isActive={currentPage === i}
              onClick={() => updatePage(i)}
              disabled={isPending}
            >
              {i}
            </PaginationButton>
          </PaginationItem>,
        );
      }
    } else {
      items.push(
        <PaginationItem key={1}>
          <PaginationButton
            isActive={currentPage === 1}
            onClick={() => updatePage(1)}
            disabled={isPending}
          >
            1
          </PaginationButton>
        </PaginationItem>,
      );

      if (currentPage > 3) {
        items.push(
          <PaginationItem key='ellipsis-start'>
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPageCount - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationButton
              isActive={currentPage === i}
              onClick={() => updatePage(i)}
              disabled={isPending}
            >
              {i}
            </PaginationButton>
          </PaginationItem>,
        );
      }

      if (currentPage < totalPageCount - 2) {
        items.push(
          <PaginationItem key='ellipsis-end'>
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }

      items.push(
        <PaginationItem key={totalPageCount}>
          <PaginationButton
            isActive={currentPage === totalPageCount}
            onClick={() => updatePage(totalPageCount)}
            disabled={isPending}
          >
            {totalPageCount}
          </PaginationButton>
        </PaginationItem>,
      );
    }

    return items;
  };

  return (
    <div className='flex flex-col md:flex-row items-center gap-3 w-full mt-4'>
      {pageSizeSelectOptions && (
        <div className='flex flex-col gap-4 flex-1'>
          <SelectRowsPerPage
            options={pageSizeSelectOptions.pageSizeOptions}
            setPageSize={updateLimit}
            limit={limit}
            disabled={isPending}
          />
        </div>
      )}
      <Pagination className={cn({ 'md:justify-end': pageSizeSelectOptions })}>
        <PaginationContent className='max-sm:gap-0'>
          <PaginationItem>
            <PaginationButton
              onClick={() => updatePage(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1 || isPending}
              className={currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}
            >
              <span className='sr-only'>Go to previous page</span>
              <svg
                className='h-4 w-4'
                fill='none'
                height='24'
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                viewBox='0 0 24 24'
                width='24'
              >
                <polyline points='15 18 9 12 15 6' />
              </svg>
            </PaginationButton>
          </PaginationItem>

          {renderPageNumbers()}

          <PaginationItem>
            <PaginationButton
              onClick={() => updatePage(Math.min(currentPage + 1, totalPageCount))}
              disabled={currentPage === totalPageCount || isPending}
              className={currentPage === totalPageCount ? 'opacity-50 cursor-not-allowed' : ''}
            >
              <span className='sr-only'>Go to next page</span>
              <svg
                className='h-4 w-4'
                fill='none'
                height='24'
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                viewBox='0 0 24 24'
                width='24'
              >
                <polyline points='9 18 15 12 9 6' />
              </svg>
            </PaginationButton>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

const PaginationButton = ({
  isActive,
  disabled,
  onClick,
  children,
  className,
}: {
  isActive?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <Button
      variant={isActive ? 'default' : 'outline'}
      size='icon'
      className={cn('h-9 w-9 rounded-md', className)}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Button>
  );
};

const SelectRowsPerPage = ({
  options,
  setPageSize,
  limit,
  disabled,
}: {
  options: number[];
  setPageSize: (newSize: number) => void;
  limit: number;
  disabled?: boolean;
}) => {
  return (
    <div className='flex items-center gap-4'>
      <span className='whitespace-nowrap text-sm'>Rows per page</span>

      <Select
        value={String(limit)}
        onValueChange={(value) => setPageSize(Number(value))}
        disabled={disabled}
      >
        <SelectTrigger className='w-20'>
          <SelectValue>{limit}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={String(option)}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
