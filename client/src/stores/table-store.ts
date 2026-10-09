import { create } from 'zustand';

export type TableFilters = Partial<Record<string, any>>;

type TableStore = {
  filters: TableFilters;
  setFilters: (key: string, value: any) => void;
  resetFilters: () => void;

  isFiltering: boolean;
  setIsFiltering: (isFiltering: boolean) => void;
};

export const useTableStore = create<TableStore>((set) => ({
  filters: {},
  setFilters: (key, value) =>
    set((state) => {
      const newFilters = { ...state.filters };
      if (value === undefined || value === null || value === '') {
        delete newFilters[key];
      } else {
        newFilters[key] = value;
      }
      return { filters: newFilters };
    }),

  resetFilters: () => set({ filters: {} }),

  isFiltering: false,
  setIsFiltering: (isFiltering) => set({ isFiltering }),
}));
