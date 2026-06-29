package auth

import (
	"context"
	"crypto/subtle"
	"errors"
	"fmt"
	"net/mail"
	"regexp"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"

	dbsqlc "omnidask/db/sqlc"
)

var (
	ErrValidation         = errors.New("validation error")
	ErrEmailAlreadyTaken  = errors.New("email already taken")
	ErrSlugAlreadyTaken   = errors.New("workspace slug already taken")
	ErrInvalidCredentials = errors.New("invalid credentials")
	ErrInvalidSession     = errors.New("invalid session")
)

var workspaceSlugPattern = regexp.MustCompile(
	`^[a-z0-9]+(?:-[a-z0-9]+)*$`,
)

type Service struct {
	repository      *Repository
	tokenManager    *TokenManager
	refreshTokenTTL time.Duration
}

func NewService(
	repository *Repository,
	tokenManager *TokenManager,
	refreshTokenTTL time.Duration,
) *Service {
	return &Service{
		repository:      repository,
		tokenManager:    tokenManager,
		refreshTokenTTL: refreshTokenTTL,
	}
}

func (s *Service) Register(
	ctx context.Context,
	request RegisterRequest,
) (RegisterResponse, error) {
	request.Email = strings.ToLower(strings.TrimSpace(request.Email))
	request.DisplayName = strings.TrimSpace(request.DisplayName)
	request.WorkspaceName = strings.TrimSpace(request.WorkspaceName)
	request.WorkspaceSlug = strings.ToLower(
		strings.TrimSpace(request.WorkspaceSlug),
	)

	if err := validateRegisterRequest(request); err != nil {
		return RegisterResponse{}, err
	}

	passwordHash, err := HashPassword(request.Password)
	if err != nil {
		return RegisterResponse{}, fmt.Errorf("hash password: %w", err)
	}

	result, err := s.repository.CreateRegistration(ctx, CreateRegistrationInput{
		Email:         request.Email,
		DisplayName:   request.DisplayName,
		PasswordHash:  passwordHash,
		WorkspaceName: request.WorkspaceName,
		WorkspaceSlug: request.WorkspaceSlug,
		Timezone:      "Asia/Ho_Chi_Minh",
	})
	if err != nil {
		return RegisterResponse{}, mapRegistrationError(err)
	}

	accessToken, err := s.tokenManager.Sign(result.User.ID)
	if err != nil {
		return RegisterResponse{}, err
	}

	return RegisterResponse{
		AccessToken: accessToken,
		TokenType:   "Bearer",
		ExpiresIn:   s.tokenManager.ExpiresInSeconds(),
		User: UserResponse{
			ID:          result.User.ID.String(),
			Email:       result.User.Email,
			DisplayName: result.User.DisplayName,
		},
		Workspace: WorkspaceResponse{
			ID:       result.Workspace.ID.String(),
			Name:     result.Workspace.Name,
			Slug:     result.Workspace.Slug,
			Timezone: result.Workspace.Timezone,
			Role:     "owner",
		},
	}, nil
}

func (s *Service) Login(
	ctx context.Context,
	request LoginRequest,
) (AuthenticationResult, error) {
	request.Email = strings.ToLower(strings.TrimSpace(request.Email))

	if request.Email == "" || request.Password == "" {
		return AuthenticationResult{}, ErrInvalidCredentials
	}

	user, err := s.repository.GetUserForLogin(ctx, request.Email)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return AuthenticationResult{}, ErrInvalidCredentials
		}

		return AuthenticationResult{}, err
	}

	if err := VerifyPassword(user.PasswordHash, request.Password); err != nil {
		return AuthenticationResult{}, ErrInvalidCredentials
	}

	refreshSecret, err := NewRefreshSecret()
	if err != nil {
		return AuthenticationResult{}, err
	}

	sessionID := uuid.New()

	if err := s.repository.CreateLoginSession(
		ctx,
		CreateSessionInput{
			ID:               sessionID,
			UserID:           user.ID,
			RefreshTokenHash: HashRefreshSecret(refreshSecret),
			ExpiresAt:        time.Now().UTC().Add(s.refreshTokenTTL),
		},
	); err != nil {
		return AuthenticationResult{}, err
	}

	return s.createAuthResult(
		ctx,
		user.ID,
		UserResponse{
			ID:          user.ID.String(),
			Email:       user.Email,
			DisplayName: user.DisplayName,
		},
		BuildRefreshCookieValue(sessionID, refreshSecret),
	)
}

func (s *Service) Refresh(
	ctx context.Context,
	cookieValue string,
) (AuthenticationResult, error) {
	sessionID, refreshSecret, err := ParseRefreshCookieValue(cookieValue)
	if err != nil {
		return AuthenticationResult{}, ErrInvalidSession
	}

	session, err := s.repository.GetActiveSession(ctx, sessionID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return AuthenticationResult{}, ErrInvalidSession
		}

		return AuthenticationResult{}, err
	}

	currentHash := HashRefreshSecret(refreshSecret)

	if subtle.ConstantTimeCompare(
		[]byte(currentHash),
		[]byte(session.RefreshTokenHash),
	) != 1 {
		_ = s.repository.RevokeSession(ctx, sessionID)
		return AuthenticationResult{}, ErrInvalidSession
	}

	newRefreshSecret, err := NewRefreshSecret()
	if err != nil {
		return AuthenticationResult{}, err
	}

	if err := s.repository.RotateSession(
		ctx,
		sessionID,
		currentHash,
		HashRefreshSecret(newRefreshSecret),
	); err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			_ = s.repository.RevokeSession(ctx, sessionID)
			return AuthenticationResult{}, ErrInvalidSession
		}

		return AuthenticationResult{}, err
	}

	user, err := s.repository.GetUserForMe(ctx, session.UserID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return AuthenticationResult{}, ErrInvalidSession
		}

		return AuthenticationResult{}, err
	}

	return s.createAuthResult(
		ctx,
		user.ID,
		UserResponse{
			ID:          user.ID.String(),
			Email:       user.Email,
			DisplayName: user.DisplayName,
		},
		BuildRefreshCookieValue(sessionID, newRefreshSecret),
	)
}

func (s *Service) Logout(
	ctx context.Context,
	cookieValue string,
) {
	sessionID, _, err := ParseRefreshCookieValue(cookieValue)
	if err != nil {
		return
	}

	_ = s.repository.RevokeSession(ctx, sessionID)
}

func (s *Service) Me(
	ctx context.Context,
	userID uuid.UUID,
) (MeResponse, error) {
	user, err := s.repository.GetUserForMe(ctx, userID)
	if err != nil {
		return MeResponse{}, err
	}

	workspaces, err := s.repository.ListUserWorkspaces(ctx, userID)
	if err != nil {
		return MeResponse{}, err
	}

	return MeResponse{
		User: UserResponse{
			ID:          user.ID.String(),
			Email:       user.Email,
			DisplayName: user.DisplayName,
		},
		Workspaces: mapWorkspaces(workspaces),
	}, nil
}

func (s *Service) createAuthResult(
	ctx context.Context,
	userID uuid.UUID,
	user UserResponse,
	refreshToken string,
) (AuthenticationResult, error) {
	accessToken, err := s.tokenManager.Sign(userID)
	if err != nil {
		return AuthenticationResult{}, err
	}

	workspaces, err := s.repository.ListUserWorkspaces(ctx, userID)
	if err != nil {
		return AuthenticationResult{}, err
	}

	return AuthenticationResult{
		RefreshToken: refreshToken,
		Response: AuthResponse{
			AccessToken: accessToken,
			TokenType:   "Bearer",
			ExpiresIn:   s.tokenManager.ExpiresInSeconds(),
			User:        user,
			Workspaces:  mapWorkspaces(workspaces),
		},
	}, nil
}

func mapWorkspaces(
	rows []dbsqlc.ListUserWorkspacesRow,
) []WorkspaceResponse {
	result := make([]WorkspaceResponse, 0, len(rows))

	for _, row := range rows {
		result = append(result, WorkspaceResponse{
			ID:       row.ID.String(),
			Name:     row.Name,
			Slug:     row.Slug,
			Timezone: row.Timezone,
			Role:     row.Role,
		})
	}

	return result
}

func validateRegisterRequest(request RegisterRequest) error {
	parsedEmail, err := mail.ParseAddress(request.Email)
	if err != nil || parsedEmail.Address != request.Email {
		return fmt.Errorf("%w: invalid email", ErrValidation)
	}

	if len(request.Password) < 12 {
		return fmt.Errorf("%w: password must have at least 12 characters", ErrValidation)
	}

	if len(request.DisplayName) < 2 || len(request.DisplayName) > 100 {
		return fmt.Errorf("%w: displayName must be 2-100 characters", ErrValidation)
	}

	if len(request.WorkspaceName) < 2 || len(request.WorkspaceName) > 100 {
		return fmt.Errorf("%w: workspaceName must be 2-100 characters", ErrValidation)
	}

	if !workspaceSlugPattern.MatchString(request.WorkspaceSlug) {
		return fmt.Errorf(
			"%w: workspaceSlug must use lowercase letters, numbers, hyphens",
			ErrValidation,
		)
	}

	return nil
}

func mapRegistrationError(err error) error {
	var pgErr *pgconn.PgError

	if errors.As(err, &pgErr) && pgErr.Code == "23505" {
		switch pgErr.ConstraintName {
		case "users_email_key":
			return ErrEmailAlreadyTaken
		case "workspaces_slug_key":
			return ErrSlugAlreadyTaken
		}
	}

	return err
}
