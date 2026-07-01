export type LoginRequest = {
  email: string;
  password: string;
};

export type AuthUser = {
  id: string;
  email: string;
  displayName: string;
};

export type AuthWorkspace = {
  id: string;
  name: string;
  slug: string;
  timezone: string;
  role: string;
};

export type AuthResponse = {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: AuthUser;
  workspaces: AuthWorkspace[];
};
