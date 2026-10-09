'use client';

import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { useState } from 'react';
import { Control, FieldValues, Path, useController } from 'react-hook-form';
import { Button } from './button';
import { FormControl } from './form';

/**
 * A form field component for entering multiple string values.
 * Designed to work with react-hook-form.
 */
interface MultiValueFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  description?: string;
  placeholder?: string;
  suggestions?: string[];
  validationPattern?: RegExp;
  validationErrorMessage?: string;
  disabled?: boolean;
  required?: boolean;
}

export function MultiValueField<T extends FieldValues>({
  control,
  name,
  placeholder = 'Type and press Enter...',
  suggestions = [],
  validationPattern = /^[a-zA-Z\s.()]+$/,
  disabled = false,
}: MultiValueFieldProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue: [] as any,
  });

  const [inputValue, setInputValue] = useState('');

  // Add a value
  const handleAdd = (value: string) => {
    // Create a properly typed current values array
    const currentValues: string[] = Array.isArray(field.value) ? field.value : [];

    // Now TypeScript knows this is a string array with includes() method
    if (!value.trim() || currentValues.includes(value.trim())) return;

    if (validationPattern.test(value.trim())) {
      field.onChange([...currentValues, value.trim()]);
      setInputValue('');
    }
  };

  // Remove a value
  const handleRemove = (index: number) => {
    const newValues = [...(field.value || [])];
    newValues.splice(index, 1);
    field.onChange(newValues);
  };

  return (
    <FormControl>
      <div className='flex flex-col gap-2 w-full'>
        <div
          className={cn(
            'flex flex-wrap gap-2 items-center px-2 font-medium bg-background text-foreground',
            'min-h-10 w-full rounded-lg border transition-colors',
            'focus-within:ring-1 focus-within:ring-primary focus-within:border-primary',
            error
              ? 'border-destructive shadow-sm shadow-destructive/20'
              : 'border-border hover:border-input',
          )}
        >
          {(field.value || []).map((tag: string, index: number) => (
            <div
              className='flex flex-row items-center border bg-muted/50 hover:bg-muted 
                  px-2 py-1 rounded-md h-auto group transition-colors'
              key={index}
            >
              <span className='text-sm font-medium'>{tag}</span>
              <button
                type='button'
                className='ml-2 p-0.5 rounded-full hover:bg-destructive/10 text-muted-foreground 
                    hover:text-destructive transition-colors'
                onClick={() => handleRemove(index)}
                aria-label={`Remove ${tag}`}
                disabled={disabled}
              >
                <X size={14} />
              </button>
            </div>
          ))}

          <div className='flex items-center w-full min-w-[180px] flex-1'>
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && inputValue.trim()) {
                  e.preventDefault();
                  handleAdd(inputValue);
                }
              }}
              placeholder={placeholder}
              disabled={disabled}
              className='w-full border-none py-1 focus:ring-0 focus:outline-none bg-transparent text-sm font-normal placeholder:text-muted-foreground'
            />

            {inputValue && (
              <Button
                type='button'
                variant='ghost'
                size='sm'
                className='h-7 text-xs'
                disabled={disabled}
                onClick={() => handleAdd(inputValue)}
              >
                Add
              </Button>
            )}
          </div>
        </div>

        {suggestions?.length > 0 && (
          <div className='mt-1 flex flex-wrap gap-1.5'>
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type='button'
                disabled={
                  disabled || (Array.isArray(field.value) && field.value.includes(suggestion))
                }
                onClick={() => handleAdd(suggestion)}
                className='text-xs px-2 py-1 bg-secondary hover:bg-secondary/80 rounded-md text-secondary-foreground disabled:opacity-50'
              >
                + {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    </FormControl>
  );
}
