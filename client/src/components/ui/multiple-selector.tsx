'use client';

import { Badge } from '@/components/ui/badge';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, ChevronDown, X } from 'lucide-react';
import * as React from 'react';

export interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

interface MultiSelectProps {
  options: Option[];
  value?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
}

const MultiSelect = ({
  options,
  value = [],
  onChange,
  placeholder = 'Select options...',
  emptyMessage = 'No options found.',
  disabled = false,
  className,
}: MultiSelectProps) => {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter((item) => item !== optionValue)
      : [...value, optionValue];

    onChange?.(newValue);
  };

  const handleRemove = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(value.filter((item) => item !== optionValue));
  };

  const selectedLabels = options
    .filter((option) => value.includes(option.value))
    .map((option) => option);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        asChild
        disabled={disabled}
        className={cn(
          'flex min-h-10 w-full items-center justify-start rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
      >
        <div className='flex flex-wrap w-full gap-1'>
          {selectedLabels.length > 0 ? (
            selectedLabels.map((option) => (
              <Badge key={option.value} variant='secondary' className='flex items-center gap-1'>
                {option.label}
                <button
                  className='ml-1 rounded-full outline-none hover:text-muted-foreground'
                  onClick={(e) => handleRemove(option.value, e)}
                >
                  <X className='h-3 w-3' />
                </button>
              </Badge>
            ))
          ) : (
            <span className='flex w-full justify-between items-center text-muted-foreground hover:cursor-pointer'>
              {placeholder}
              <ChevronDown size={16} />
            </span>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0' align='start'>
        <Command>
          <CommandInput placeholder='Search options...' />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {options.map((option, index) => (
                <CommandItem
                  key={index + option.value}
                  onSelect={() => handleSelect(option.value)}
                  className={cn(
                    'cursor-pointer',
                    option.disabled && 'opacity-50 pointer-events-none',
                  )}
                >
                  <div
                    className={cn(
                      'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                      value.includes(option.value)
                        ? 'bg-primary text-primary'
                        : 'opacity-50 [&_svg]:invisible',
                    )}
                  >
                    <Check className='h-4 w-4' />
                  </div>
                  <span>{option.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                onSelect={() => setOpen(false)}
                className='cursor-pointer justify-center font-medium'
              >
                Done
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default MultiSelect;
