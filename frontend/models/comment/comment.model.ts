import { Dispatch, SetStateAction } from 'react';
import { IPaginationRequest } from '../common/ResponseMessage.model';

export interface ICommentRequestModel {
  content?: string;
  parentId?: number;
  postId?: number;
  time?: string;
}

export interface ICommentRequestModelCommentId extends ICommentSubmittingRequestModel {
  commentId: number;
}

export interface ICommentSubmittingRequestModel extends ICommentRequestModel {
  setSubmitting?: Dispatch<SetStateAction<boolean>>;
}

export interface ICommentsPostResponse {
  id: number;
  userId: string;
  fullName: string;
  postId: number;
  parentId: number | null;
  time: string;
  content: string;
  avatar: string;
  childs: ICommentsPostResponse[] | [];
}

export interface IQueryGetCommentsPost extends IPaginationRequest {
  postId: string;
}
