import { Button } from '@/components/ui/button';
import { useTableStore } from '@/stores/table-store';
import { Filter, X } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

interface PageFilterClearButtonProps {
  className?: string;
}

export const PageFilterClearButton = ({ className = '' }: PageFilterClearButtonProps) => {
  const { filters, resetFilters } = useTableStore(
    useShallow((state) => ({
      filters: state.filters,
      resetFilters: state.resetFilters,
    })),
  );

  // Check if there are any active filters
  const hasFilters = Object.keys(filters).length > 0;

  // Don't render if no filters are active
  if (!hasFilters) {
    return null;
  }

  return (
    <Button
      variant='outline'
      size='sm'
      onClick={() => resetFilters()}
      className={`flex items-center gap-2 ${className}`}
    >
      <Filter className='w-4 h-4' />
      Clear Filters
      <X className='w-3 h-3' />
    </Button>
  );
};
