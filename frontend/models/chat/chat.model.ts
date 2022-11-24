import { IPageableResponse } from '../common/ResponseMessage.model';

export interface IRoomRequest {
  friends: string[];
  time: string;
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
