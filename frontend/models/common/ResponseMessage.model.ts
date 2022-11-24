export interface ResponseMessage {
  title?: string;
  type: MessageType;
  code?: number | string;
  message: string;
}

export type MessageType = 'success' | 'error' | 'warning' | 'info' | 'loading';

export interface IPaginationRequest {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortType?: 'DESC' | 'ASC';
}

export interface IPageableResponse {
  pageNumber: number;
  totalItems: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
  pageSize: number;
}
