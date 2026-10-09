export interface ICommonResponseDTO<T> {
  error: boolean;
  message: string;
  data: T;
}

export interface IPaginatedResponseDTO<T, U = IBasePaginationExtras> {
  results: T[];
  extras: U;
}

export interface IBasePaginationExtras {
  total: number;
  limit: number;
  skip: number;
}

export interface PreSignedURLResponseDTO {
  urls: {
    key: string;
    url: string;
  }[];
}

export interface IPaginationQuery {
  skip?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: string;
  created_from?: string;
  created_to?: string;
  hide_deleted?: boolean;
  search_key?: string;
}
