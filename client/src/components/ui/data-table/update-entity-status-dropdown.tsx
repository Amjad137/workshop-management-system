import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table } from '@tanstack/react-table';
import { AlertCircle, ChevronDown } from 'lucide-react';
import { ReactNode, useState } from 'react';

export interface StatusAction<TValue = string> {
  label: string;
  value: TValue;
  icon: ReactNode;
}

type UpdateEntityStatusProps<TData, TValue = string> = {
  table: Table<TData>;
  currentValue?: string;
  isPending: boolean;
  updateCallback: (value: TValue) => Promise<void>;
  actions: StatusAction<TValue>[];
  selectedCount: number;
  selectedNames: string[];
  buttonText?: string;
  entityType?: string;
};

export const UpdateEntityStatus = <TData, TValue>({
  table,
  currentValue,
  isPending,
  updateCallback,
  actions,
  selectedCount,
  selectedNames,
  buttonText = 'Update Status',
  entityType = 'items',
}: UpdateEntityStatusProps<TData, TValue>) => {
  const [confirmedValue, setConfirmedValue] = useState<TValue | null>(null);

  const updateStatus = (value: TValue) => {
    updateCallback(value)
      .then(() => table.resetRowSelection())
      .finally(() => setConfirmedValue(null));
  };

  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className='flex items-center gap-2'>
      {currentValue && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' size='sm'>
              {buttonText} <ChevronDown className='ml-2 h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-48'>
            {actions
              .filter((act) => !currentValue || act.value !== currentValue)
              .map((action) => (
                <DropdownMenuItem
                  key={String(action.value)}
                  onClick={() => setConfirmedValue(action.value)}
                  className='cursor-pointer'
                >
                  <div className='flex items-center'>
                    {action.icon}
                    {action.label}
                  </div>
                </DropdownMenuItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {confirmedValue && (
        <Dialog open onOpenChange={() => setConfirmedValue(null)}>
          <DialogContent>
            <DialogTitle className='flex flex-col items-center gap-2'>
              <AlertCircle className='h-6 w-6 text-amber-500' />
              <span>Confirm Action</span>
            </DialogTitle>

            <div className='py-4'>
              <p className='text-center mb-2'>{`Are you sure you want to update the ${entityType}`}</p>

              <div className='max-h-32 overflow-auto border rounded-md p-2 mt-4'>
                <ul className='text-sm list-disc pl-4'>
                  {selectedNames.map((name, i) => (
                    <li key={i}>{name}</li>
                  ))}
                </ul>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant='outline'
                onClick={() => setConfirmedValue(null)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button onClick={() => updateStatus(confirmedValue)} disabled={isPending}>
                {isPending ? 'Processing...' : 'Confirm'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
