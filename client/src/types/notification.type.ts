import { IBaseEntity } from './common.type';

export interface INotification extends IBaseEntity {
  title: string;
  message: string;
  recipientId: string;
  senderId?: string;
  isRead: boolean;
  relatedId?: string;
  relatedType?: string;
}
