'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment, useMemo } from 'react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

// Helper function unchanged
const formatPathSegment = (segment: string): string => {
  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export function DynamicBreadcrumb() {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    // Special case for home page
    if (pathname === '/') {
      return [
        { href: '/', title: 'Biztock' },
        { href: '/', title: 'Dashboard' },
      ];
    }

    // Existing breadcrumb generation logic
    const pathSegments = pathname.split('/').filter((segment) => segment.length > 0);

    const crumbList = pathSegments.map((segment, index) => {
      const href = '/' + pathSegments.slice(0, index + 1).join('/');
      const title = formatPathSegment(segment);
      return { href, title };
    });

    return [{ href: '/', title: 'Biztock' }, ...crumbList];
  }, [pathname]);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((breadcrumb, i) => (
          <Fragment key={breadcrumb.href + i}>
            {i < breadcrumbs.length - 1 ? (
              //bread crumbs with separator until the last element
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href={breadcrumb.href}>{breadcrumb.title}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            ) : (
              // last breadcrumb without separator
              <BreadcrumbItem>
                <BreadcrumbPage>{breadcrumb.title}</BreadcrumbPage>
              </BreadcrumbItem>
            )}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
