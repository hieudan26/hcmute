export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token_name: string;
  access_token: string;
  token_type: string;
  id_token: string;
  refresh_token: string;
  expires_in: string;
}
