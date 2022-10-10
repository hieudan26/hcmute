export interface IRegisterRequest {
  email: string;
  password: string;
  is_first_login: string;
  role: string;
}

export interface IForgotPasswordSetNew {
  email: string;
  code: string;
  password: string;
}

// export interface LoginResponse {
//   token_name: string;
//   access_token: string;
//   token_type: string;
//   id_token: string;
//   refresh_token: string;
//   expires_in: string;
// }
