export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type IBaseEntity = {
  _id: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};
