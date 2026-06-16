export interface Auth {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface TokenFormat {
  iss: string;
  sub: string;
  exp: number;
  iat: number;
  userId: number;
  scope: string;
}
