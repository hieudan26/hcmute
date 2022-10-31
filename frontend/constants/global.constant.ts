import { AxiosResponse } from 'axios';

export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

export enum TypeToggle {
  Loading = 'LOADING',
  Logout = 'LOGOUT',
}

export interface AxiosResponseStatus<T = any, D = any> extends AxiosResponse<T, D> {
  isSuccess?: boolean;
}
