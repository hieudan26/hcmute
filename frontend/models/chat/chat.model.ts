import { IPageableResponse } from '../common/ResponseMessage.model';

export interface IRoomRequest {
  friends: string[];
  name?: string;
  ownerId: string;
  time: string;
  type: 'SINGLE' | 'GROUP';
}

export interface IMessage {
  avatar: string;
  fullName: string;
  sender: string;
  room: string | number;
  time: string;
  content: string;
}

export interface IMessagesResponse {
  content: IMessage[];
  pageable: IPageableResponse;
}
