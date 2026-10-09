import { IBaseEntity } from '@/types/common.type';

export enum ENVIRONMENTS {
  PRODUCTION = 'production',
  QA = 'qa',
  DEV = 'development',
  LOCAL = 'local',
}

export enum ENTITY_STATUS {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  HIDDEN = 'HIDDEN',
  DELETED = 'DELETED',
}

export enum ENTITY_SORT {
  ASC = 'asc',
  DESC = 'desc',
}

export enum COMMON_SORT {
  DATE = 'createdAt',
}

export enum API_QUERY_PARAMS {
  SEARCH_KEY = 'search_key',
  LIMIT = 'limit',
  SKIP = 'skip',
  SORT_BY = 'sort_by',
  SORT_ORDER = 'sort_order',
  CREATED_FROM = 'created_from',
  CREATED_TO = 'created_to',
  HIDE_DELETED = 'hide_deleted',
  STATUS = 'status',
}

export const FILE_TYPES = {
  JPEG: 'image/jpeg',
  PNG: 'image/png',
  WEBP: 'image/webp',
} as const;

export type OmitBaseEntity<T extends IBaseEntity> = Omit<T, '_id' | 'createdAt' | 'updatedAt'>;
