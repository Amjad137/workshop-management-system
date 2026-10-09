import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { DynamicBreadcrumb } from './dynamic-bread-crumb2';

export function SiteHeader() {
  return (
    <header
      className={cn(
        'sticky top-0 z-50 flex h-12 shrink-0 items-center gap-2 border-b shadow-md backdrop-blur-lg bg-background/50',
        'transition-[width,height] ease-linear',
      )}
    >
      <div className='flex w-full items-center gap-1 px-2 lg:gap-2 lg:px-4'>
        <SidebarTrigger className='-ml-1' />
        <Separator orientation='vertical' className='mx-2 data-[orientation=vertical]:h-4' />
        <DynamicBreadcrumb />
      </div>
    </header>
  );
}
