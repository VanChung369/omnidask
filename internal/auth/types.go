package auth

type RegisterRequest struct {
	Email         string `json:"email"`
	Password      string `json:"password"`
	DisplayName   string `json:"displayName"`
	WorkspaceName string `json:"workspaceName"`
	WorkspaceSlug string `json:"workspaceSlug"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type UserResponse struct {
	ID          string `json:"id"`
	Email       string `json:"email"`
	DisplayName string `json:"displayName"`
}

type WorkspaceResponse struct {
	ID       string `json:"id"`
	Name     string `json:"name"`
	Slug     string `json:"slug"`
	Timezone string `json:"timezone"`
	Role     string `json:"role"`
}

type RegisterResponse struct {
	AccessToken string            `json:"accessToken"`
	TokenType   string            `json:"tokenType"`
	ExpiresIn   int64             `json:"expiresIn"`
	User        UserResponse      `json:"user"`
	Workspace   WorkspaceResponse `json:"workspace"`
}

type AuthResponse struct {
	AccessToken string              `json:"accessToken"`
	TokenType   string              `json:"tokenType"`
	ExpiresIn   int64               `json:"expiresIn"`
	User        UserResponse        `json:"user"`
	Workspaces  []WorkspaceResponse `json:"workspaces"`
}

type MeResponse struct {
	User       UserResponse        `json:"user"`
	Workspaces []WorkspaceResponse `json:"workspaces"`
}

type AuthenticationResult struct {
	Response     AuthResponse
	RefreshToken string
}

type RegistrationAuthenticationResult struct {
	Response     RegisterResponse
	RefreshToken string
}
