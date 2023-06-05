import { Dispatch, SetStateAction } from 'react';
import { IPaginationRequest } from '../common/ResponseMessage.model';

export interface IPostReportResponseModel {
  avatar: string,
  content: string,
  fullName: string,
  id: string,
  postId: number,
  time: string,
  userId: string,
}

export interface IPostRequestModel {
  title: string;
  content: string;
  hashTags?: string[];
  images: string[];
  time?: string;
  type: string;
}

export interface IPostRequestModelLoading extends IPostRequestModel {
  setSubmitting?: Dispatch<SetStateAction<boolean>>;
}

export interface IPostResponseModel {
  id: string;
  userId: string;
  avatar: string;
  fullName: string;
  type: string;
  title: string;
  content: string;
  time: string;
  commentNumber: number;
  reactNumber: number;
  images: string[];
  status: string;
  reportCount: number;
  isReacted: boolean;
  isDeleted?: boolean;
  hashTags: string[];
}

export interface IPostPaginationByType extends IPaginationRequest {
  type: string;
}

export interface IPostPaginationByTypeAndUserId extends IPostPaginationByType {
  userId: string;
}

export interface IPostRequestModelPostId extends IPostRequestModel {
  postId: string;
}
