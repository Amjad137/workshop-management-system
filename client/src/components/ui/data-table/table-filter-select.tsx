import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTableStore } from '@/stores/table-store';
import { useShallow } from 'zustand/react/shallow';

interface Option {
  label: string;
  value: string;
}

interface SelectFilterProps<T extends string = string> {
  options: Option[];
  paramKey: T;
  placeholder?: string;
  label?: string;
  icon?: React.ReactNode;
  className?: string;
  includeAll?: boolean;
  allLabel?: string;
}

export const SelectFilter = ({
  options,
  paramKey,
  placeholder = 'Filter...',
  label,
  icon,
  className = '',
  includeAll = true,
  allLabel = 'All',
}: SelectFilterProps) => {
  const { filters, setFilters } = useTableStore(
    useShallow((state) => ({ filters: state.filters, setFilters: state.setFilters })),
  );

  return (
    <div className={className}>
      {label && <Label className='mb-2 text-sm font-medium'>{label}</Label>}
      <Select
        value={filters[paramKey] ?? ''}
        onValueChange={(value) => setFilters(paramKey, value === 'all' ? undefined : value)}
      >
        <SelectTrigger className='h-9 min-w-fit max-w-[400px] border-border hover:bg-muted/20 focus:border-none focus:ring-0 focus:ring-offset-0'>
          <div className='flex items-center gap-2'>
            {icon}
            <SelectValue placeholder={placeholder} />
          </div>
        </SelectTrigger>
        <SelectContent>
          {includeAll && <SelectItem value='all'>{allLabel}</SelectItem>}
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
