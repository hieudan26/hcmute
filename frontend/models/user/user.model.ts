import { IPaginationRequest } from '../common/ResponseMessage.model';

export interface IUserUpdateInformation {
  avatar: string;
  city: string;
  country: string;
  coverBackground: string;
  district?: string;
  dob: string;
  firstName: string;
  gender: string;
  lastName: string;
  phoneNumber: string;
  summary?: string;
  village?: string;
}

export interface IUserFirstLoginRequest {
  id: string;
  role: string;
  avatar?: string;
  city?: string;
  country?: string;
  coverBackground?: string;
  district?: string;
  dob?: string;
  email: string;
  firstName?: string;
  gender?: string;
  lastName?: string;
  phoneNumber?: string;
  summary?: string;
  village?: string;
  fullName?: string;
  isLoggedIn: boolean;
  isFirstLogin: boolean;
  disable: boolean;
  lastModifiedDate?: number;
  creationDate?: number;
}

export interface IQueryGetFriendByUserAndStatus extends IPaginationRequest {
  userId: string;
  status?: string | undefined;
}

export interface IFriendResponse {
  avatar: string;
  fullName: string;
  status: string;
  time: string;
  userId: string;
}

export interface IFriendRequest {
  friendId: string;
  status: string;
  time: string;
  userId?: string;
}
