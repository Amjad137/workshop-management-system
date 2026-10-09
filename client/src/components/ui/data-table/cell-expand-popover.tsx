import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

type Props = {
  content: string;
};

const CellExpandPopover = ({ content }: Props) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className='inline-block w-[140px] cursor-pointer'>
          <span className='text-xs text-foreground text-left line-clamp-1'>{content}</span>
        </div>
      </PopoverTrigger>
      <PopoverContent className='max-w-xs p-2 text-xs'>{content}</PopoverContent>
    </Popover>
  );
};

export default CellExpandPopover;
