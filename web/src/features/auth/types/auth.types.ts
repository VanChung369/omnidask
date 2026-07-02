export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
  displayName: string;
  workspaceName: string;
  workspaceSlug: string;
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

export type RegisterResponse = {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: AuthUser;
  workspace: AuthWorkspace;
};

export type AuthSession = {
  accessToken: string;
  user: AuthUser;
  workspaces: AuthWorkspace[];
};

export type SessionResponse = {
  user: AuthUser;
  workspaces: AuthWorkspace[];
};
