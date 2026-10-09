import { useState } from 'react';

export function useSorting(initialField = '_id', initialOrder = 'asc') {
  const [sorting, setSorting] = useState([{ id: initialField, desc: initialOrder === 'desc' }]);

  let order;
  if (sorting.length === 0) {
    order = initialOrder;
  } else {
    order = sorting[0].desc ? 'desc' : 'asc';
  }

  const field = sorting.length ? sorting[0].id : initialField;

  return {
    sorting,
    onSortingChange: setSorting,
    order,
    field,
  };
}
