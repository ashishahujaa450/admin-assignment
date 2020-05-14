export interface AuthInterface {
  email: string;
  password: string;
  returnSecureToken?: boolean;
  userName: string;
}

export interface AuthResponse {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}
