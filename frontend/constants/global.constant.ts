import { AxiosResponse } from 'axios';

export enum STATUS_PLACES {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export const ALL_TYPE_SEARCH = [
  { value: 'faq', label: 'faq' },
  { value: 'experience', label: 'experience' },
  { value: 'place', label: 'place' },
  { value: 'user', label: 'user' },
];

export enum TYPE_SEARCH {
  FAQ = 'faq',
  EXPERIENCE = 'experience',
  PLACE = 'place',
  USER = 'user',
}

export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

export enum TypeToggle {
  Loading = 'LOADING',
  Logout = 'LOGOUT',
}

export enum FriendStatus {
  FRIEND = 'friend',
  NO_FRIEND = 'no_friend',
  BLOCKED = 'blocked', // ng bị block
  BLOCKING = 'blocking', // mình block
  PENDING = 'pending', //ngta gửi lời mời mình, mình chưa accept
  INVITED = 'invited', // mình gửi lời mời kb cho ng khác, ngta chưa accept
}

export interface AxiosResponseStatus<T = any, D = any> extends AxiosResponse<T, D> {
  isSuccess?: boolean;
}
