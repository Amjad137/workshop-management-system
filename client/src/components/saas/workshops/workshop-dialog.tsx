'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, string, number, InferType } from 'yup';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { IWorkshop, WORKSHOP_STATUS } from '@/types/workshop.type';
import { useCreateWorkshop, useUpdateWorkshop } from '@/hooks/use-workshops';

const LOCATIONS = ['Downtown Studio', 'North Campus', 'West End Hub'];
const CATEGORIES = ['Pottery', 'Coding', 'Fitness', 'Art & Craft', 'Music', 'Culinary'];

const workshopFormSchema = object({
  code: string().required('Workshop code is required').trim(),
  title: string().required('Title is required').trim(),
  description: string().trim().optional(),
  category: string().required('Category is required'),
  location: string().required('Location is required'),
  instructor: string().required('Instructor is required').trim(),
  date: string().required('Date and time are required'),
  capacity: number()
    .typeError('Capacity must be a valid number')
    .required('Capacity is required')
    .min(1, 'Capacity must be at least 1')
    .integer('Capacity must be an integer'),
  status: string().oneOf(Object.values(WORKSHOP_STATUS)).default(WORKSHOP_STATUS.SCHEDULED),
});

type WorkshopFormValues = InferType<typeof workshopFormSchema>;

interface Props {
  workshop?: IWorkshop | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function WorkshopDialog({ workshop, open, onOpenChange, onSuccess }: Props) {
  const isEditing = Boolean(workshop);
  const { mutateAsync: createMutation } = useCreateWorkshop();
  const { mutateAsync: updateMutation } = useUpdateWorkshop();

  const form = useForm<WorkshopFormValues>({
    resolver: yupResolver(workshopFormSchema),
    defaultValues: {
      code: '',
      title: '',
      description: '',
      category: CATEGORIES[0],
      location: LOCATIONS[0],
      instructor: '',
      date: '',
      capacity: 10,
      status: WORKSHOP_STATUS.SCHEDULED,
    },
  });

  useEffect(() => {
    if (workshop) {
      let isoDate = '';
      try {
        const d = new Date(workshop.date);
        isoDate = d.toISOString().slice(0, 16);
      } catch {
        isoDate = '';
      }

      form.reset({
        code: workshop.code,
        title: workshop.title,
        description: workshop.description || '',
        category: workshop.category || CATEGORIES[0],
        location: workshop.location || LOCATIONS[0],
        instructor: workshop.instructor,
        date: isoDate,
        capacity: workshop.capacity,
        status: workshop.status,
      });
    } else {
      form.reset({
        code: '',
        title: '',
        description: '',
        category: CATEGORIES[0],
        location: LOCATIONS[0],
        instructor: '',
        date: '',
        capacity: 10,
        status: WORKSHOP_STATUS.SCHEDULED,
      });
    }
  }, [workshop, open, form]);

  const onSubmit = async (values: WorkshopFormValues) => {
    try {
      if (isEditing && workshop) {
        await updateMutation({
          id: workshop._id,
          payload: {
            title: values.title.trim(),
            description: values.description?.trim() || undefined,
            category: values.category,
            location: values.location,
            instructor: values.instructor.trim(),
            date: new Date(values.date).toISOString(),
            capacity: values.capacity,
            status: values.status as WORKSHOP_STATUS,
          },
        });
      } else {
        await createMutation({
          code: values.code.trim().toUpperCase(),
          title: values.title.trim(),
          description: values.description?.trim() || undefined,
          category: values.category,
          location: values.location,
          instructor: values.instructor.trim(),
          date: new Date(values.date).toISOString(),
          capacity: values.capacity,
        });
      }

      onOpenChange(false);
      onSuccess();
    } catch {
      // Handled in hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[540px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? `Edit Workshop (${workshop?.code})` : 'Schedule New Workshop'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update workshop details or adjust seating capacity.'
              : 'Add a new training workshop to the catalogue for staff to register attendees.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 pt-2'>
            <div className='grid grid-cols-2 gap-3'>
              <FormField
                control={form.control}
                name='code'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Workshop Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='e.g., POT-101'
                        {...field}
                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                        disabled={isEditing || form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='category'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Category</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={form.formState.isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select category' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CATEGORIES.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Workshop Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='e.g., Wheel Throwing Basics'
                      {...field}
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Short overview of what will be covered...'
                      rows={2}
                      {...field}
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-2 gap-3'>
              <FormField
                control={form.control}
                name='location'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Location</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={form.formState.isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select location' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {LOCATIONS.map((loc) => (
                          <SelectItem key={loc} value={loc}>
                            {loc}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='instructor'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Instructor</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='e.g., Elena Rostova'
                        {...field}
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid grid-cols-2 gap-3'>
              <FormField
                control={form.control}
                name='date'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Date & Time</FormLabel>
                    <FormControl>
                      <Input
                        type='datetime-local'
                        {...field}
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='capacity'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Total Capacity (Seats)</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        min={workshop ? workshop.activeRegistrationsCount : 1}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {isEditing && (
              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Status</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={form.formState.isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Status' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={WORKSHOP_STATUS.SCHEDULED}>Scheduled</SelectItem>
                        <SelectItem value={WORKSHOP_STATUS.IN_PROGRESS}>In Progress</SelectItem>
                        <SelectItem value={WORKSHOP_STATUS.COMPLETED}>Completed</SelectItem>
                        <SelectItem value={WORKSHOP_STATUS.CANCELLED}>Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter className='pt-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
                disabled={form.formState.isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                loading={form.formState.isSubmitting}
                disabled={form.formState.isSubmitting}
              >
                {isEditing ? 'Save Changes' : 'Create Workshop'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
