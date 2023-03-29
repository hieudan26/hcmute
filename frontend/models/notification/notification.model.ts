export interface INotificationResponse {
  id: number | string;
  type: string;
  toUser: string;
  fromUser: string;
  fullName: string;
  description: string;
  creationDate: string;
  contentId: number | string;
  status: boolean;
}
