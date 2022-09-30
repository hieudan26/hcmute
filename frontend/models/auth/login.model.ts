export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ILoginResponse {
  token_name: string;
  access_token: string;
  token_type: string;
  id_token: string;
  refresh_token: string;
  expires_in: string;
}
