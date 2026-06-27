package auth

import (
	"context"
	"errors"
	"fmt"
	"net/mail"
	"regexp"
	"strings"

	"github.com/jackc/pgx/v5/pgconn"
)

var (
	ErrValidation        = errors.New("validation error")
	ErrEmailAlreadyTaken = errors.New("email already taken")
	ErrSlugAlreadyTaken  = errors.New("workspace slug already taken")
)

var workspaceSlugPattern = regexp.MustCompile(
	`^[a-z0-9]+(?:-[a-z0-9]+)*$`,
)

type Service struct {
	repository   *Repository
	tokenManager *TokenManager
}

func NewService(
	repository *Repository,
	tokenManager *TokenManager,
) *Service {
	return &Service{
		repository:   repository,
		tokenManager: tokenManager,
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
