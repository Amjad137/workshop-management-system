// src/hooks/use-table-url-sync.ts
import { API_QUERY_PARAMS } from '@/constants/common.constants';
import { useTableStore } from '@/stores/table-store';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';

export function useTableUrlSync(mode: 'table' | 'cards' = 'table') {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const hasInitialized = useRef(false);
  const lastUrlParams = useRef<string>('');
  const { filters, setFilters } = useTableStore(
    useShallow((state) => ({
      filters: state.filters,
      setFilters: state.setFilters,
    })),
  );

  // Load initial filters from URL
  useEffect(() => {
    if (hasInitialized.current) return;
    console.log('Initializing from URL');

    const urlParams: Record<string, any> = {};

    // Extract params from URL
    searchParams.forEach((value, key) => {
      // Handle numeric values
      if (/^\d+$/.test(value)) {
        urlParams[key] = Number(value);
      } else if (value === 'true' || value === 'false') {
        urlParams[key] = value === 'true';
      } else {
        urlParams[key] = value;
      }
    });

    Object.entries(urlParams).forEach(([key, value]) => {
      setFilters(key as API_QUERY_PARAMS, value);
    });

    lastUrlParams.current = searchParams.toString();
    hasInitialized.current = true;
  }, [searchParams, setFilters]);

  // For table mode: Full bidirectional sync
  useEffect(() => {
    if (!hasInitialized.current || mode !== 'table') return;

    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, String(value));
      }
    });

    const newParamsString = params.toString();
    if (newParamsString !== lastUrlParams.current) {
      console.log('Table mode: syncing filters to URL');
      router.replace(`${pathname}?${newParamsString}`, { scroll: false });
      lastUrlParams.current = newParamsString;
    }
  }, [filters, pathname, router, mode]);

  // For cards mode: Only sync non-pagination filters from store to URL
  useEffect(() => {
    if (!hasInitialized.current || mode !== 'cards') return;

    const currentParams = new URLSearchParams(searchParams.toString());
    const paginationParams = {
      skip: currentParams.get('skip'),
      limit: currentParams.get('limit'),
    };

    const params = new URLSearchParams();

    // Preserve pagination params from URL
    if (paginationParams.skip) params.set('skip', paginationParams.skip);
    if (paginationParams.limit) params.set('limit', paginationParams.limit);

    // Add non-pagination filters from store
    Object.entries(filters).forEach(([key, value]) => {
      if (
        key !== 'skip' &&
        key !== 'limit' &&
        value !== undefined &&
        value !== null &&
        value !== ''
      ) {
        params.set(key, String(value));
      }
    });

    const newParamsString = params.toString();
    const currentParamsString = searchParams.toString();

    if (newParamsString !== currentParamsString) {
      console.log('Cards mode: syncing filters to URL');
      router.replace(`${pathname}?${newParamsString}`, { scroll: false });
    }
  }, [filters, pathname, router, mode, searchParams]);

  return { filters };
}
