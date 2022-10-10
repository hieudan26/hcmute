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
}
