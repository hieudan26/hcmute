import { AxiosResponse } from 'axios';

export enum STATUS_PLACES {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export const NUMBER_OF_DAYS = [
  { value: 1, label: '1 Ngày' },
  { value: 2, label: '2 Ngày' },
  { value: 3, label: '3 Ngày' },
  { value: 4, label: '4 Ngày' },
  { value: 5, label: '5 Ngày' },
  { value: 6, label: '6 Ngày' },
  { value: 7, label: '7 Ngày' },
  { value: 8, label: '8 Ngày' },
  { value: 9, label: '9 Ngày' },
  { value: 10, label: '10 Ngày' },
  { value: 11, label: '> 10 Ngày' },
];

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
