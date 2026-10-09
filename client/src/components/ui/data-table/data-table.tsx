import { Button } from '@/components/ui/button';
import { PaginationWithLinks } from '@/components/ui/data-table/pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { IBasePaginationExtras } from '@/dto/common.dto';
import { useTableStore } from '@/stores/table-store';

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  Table as ITable,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { X } from 'lucide-react';
import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  extras?: IBasePaginationExtras;
  filterComponents?: React.ReactNode;
  actionComponents?: (props: { table: ITable<TData> }) => React.ReactNode;
  manualFiltering?: boolean;
  manualSorting?: boolean;
  manualPagination?: boolean;
  defaultSorting?: SortingState;
  showResetFilters?: boolean;
  editable?: boolean;
}

export const DataTable = <TData, TValue>({
  columns,
  data,
  extras,
  filterComponents,
  actionComponents,
  manualFiltering = false,
  manualSorting = false,
  manualPagination = true,
  defaultSorting = [],
  showResetFilters = true,
  editable = true,
}: DataTableProps<TData, TValue>) => {
  const [sorting, setSorting] = useState<SortingState>(defaultSorting);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Get filter state from store
  const { filters, resetFilters } = useTableStore(
    useShallow((state) => ({
      filters: state.filters,
      resetFilters: state.resetFilters,
    })),
  );

  // Filter out action columns if not editable
  const displayColumns = editable
    ? columns
    : columns.filter((col) => {
        // Only check accessorKey since action columns use this property
        const accessorKey = 'accessorKey' in col ? col.accessorKey : null;
        return accessorKey !== 'selectedRowsAndActions';
      });

  // Only show action components if editable
  const displayActionComponents = editable ? actionComponents : undefined;

  const table = useReactTable({
    data,
    columns: displayColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    enableSorting: true,
    manualSorting,
    manualFiltering,
    manualPagination,
    // Optional row selection
    enableRowSelection: true,
    state: {
      sorting,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize: 20,
      },
      sorting,
    },
    pageCount: extras ? Math.ceil(extras.total / extras.limit) : undefined,
  });

  const hasFilters = Object.keys(filters).length > 0;

  return (
    <div className='flex flex-col gap-4 pt-2'>
      <div className='flex flex-wrap justify-between gap-4'>
        <div className='flex flex-wrap items-center gap-3'>
          {filterComponents}
          {showResetFilters && hasFilters && (
            <Button
              variant='ghost'
              size='sm'
              onClick={() => resetFilters()}
              className='h-8 px-2 lg:px-3 ml-2'
            >
              Reset
              <X className='ml-2 h-4 w-4' />
            </Button>
          )}
        </div>

        <div className='flex flex-wrap items-center gap-3'>
          {displayActionComponents && displayActionComponents({ table })}
        </div>
      </div>

      <div className='border rounded-lg overflow-hidden'>
        <Table className='space-y-3 bg-background'>
          <TableHeader className='hover:bg-background hover:text-foreground'>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className='text-xs font-medium text-muted'>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className='m-4'>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className='bg-background text-xs font-normal min-h-[2.5rem]'
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className='py-1'>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={displayColumns.length} className='h-24 text-center'>
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {extras && (
        <PaginationWithLinks
          skip={extras.skip}
          limit={extras.limit}
          totalCount={extras.total}
          pageSizeSelectOptions={{ pageSizeOptions: [10, 20, 50, 100] }}
          isTable={true}
        />
      )}
    </div>
  );
};
