package auth

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"

	dbsqlc "omnidask/db/sqlc"
)

type Repository struct {
	pool    *pgxpool.Pool
	queries *dbsqlc.Queries
}

type CreateSessionInput struct {
	ID               uuid.UUID
	UserID           uuid.UUID
	RefreshTokenHash string
	ExpiresAt        time.Time
}

type CreateRegistrationInput struct {
	Email            string
	DisplayName      string
	PasswordHash     string
	WorkspaceName    string
	WorkspaceSlug    string
	Timezone         string
	SessionID        uuid.UUID
	RefreshTokenHash string
	SessionExpiresAt time.Time
}

type RegistrationResult struct {
	User      dbsqlc.CreateUserRow
	Workspace dbsqlc.CreateWorkspaceRow
}

func NewRepository(pool *pgxpool.Pool) *Repository {
	return &Repository{
		pool:    pool,
		queries: dbsqlc.New(pool),
	}
}

func (r *Repository) CreateRegistration(
	ctx context.Context,
	input CreateRegistrationInput,
) (RegistrationResult, error) {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return RegistrationResult{}, fmt.Errorf("begin transaction: %w", err)
	}
	defer func() {
		_ = tx.Rollback(ctx)
	}()

	qtx := r.queries.WithTx(tx)

	user, err := qtx.CreateUser(ctx, dbsqlc.CreateUserParams{
		Email:        input.Email,
		DisplayName:  input.DisplayName,
		PasswordHash: input.PasswordHash,
	})
	if err != nil {
		return RegistrationResult{}, fmt.Errorf("create user: %w", err)
	}

	workspace, err := qtx.CreateWorkspace(ctx, dbsqlc.CreateWorkspaceParams{
		Name:     input.WorkspaceName,
		Slug:     input.WorkspaceSlug,
		Timezone: input.Timezone,
	})
	if err != nil {
		return RegistrationResult{}, fmt.Errorf("create workspace: %w", err)
	}

	err = qtx.CreateWorkspaceMember(ctx, dbsqlc.CreateWorkspaceMemberParams{
		WorkspaceID: workspace.ID,
		UserID:      user.ID,
		Role:        "owner",
	})
	if err != nil {
		return RegistrationResult{}, fmt.Errorf("create workspace owner: %w", err)
	}

	if _, err := qtx.CreateAuthSession(
		ctx,
		dbsqlc.CreateAuthSessionParams{
			SessionID:        input.SessionID,
			UserID:           user.ID,
			RefreshTokenHash: input.RefreshTokenHash,
			ExpiresAt: pgtype.Timestamptz{
				Time:  input.SessionExpiresAt,
				Valid: true,
			},
		},
	); err != nil {
		return RegistrationResult{}, fmt.Errorf("create auth session: %w", err)
	}

	if err := qtx.UpdateUserLastLogin(ctx, user.ID); err != nil {
		return RegistrationResult{}, fmt.Errorf("update user last login: %w", err)
	}

	if err := tx.Commit(ctx); err != nil {
		return RegistrationResult{}, fmt.Errorf("commit registration: %w", err)
	}

	return RegistrationResult{
		User:      user,
		Workspace: workspace,
	}, nil
}

func (r *Repository) CreateLoginSession(
	ctx context.Context,
	input CreateSessionInput,
) error {
	tx, err := r.pool.BeginTx(ctx, pgx.TxOptions{})
	if err != nil {
		return fmt.Errorf("begin transaction: %w", err)
	}
	defer func() {
		_ = tx.Rollback(ctx)
	}()

	qtx := r.queries.WithTx(tx)

	if _, err := qtx.CreateAuthSession(
		ctx,
		dbsqlc.CreateAuthSessionParams{
			SessionID:        input.ID,
			UserID:           input.UserID,
			RefreshTokenHash: input.RefreshTokenHash,
			ExpiresAt: pgtype.Timestamptz{
				Time:  input.ExpiresAt,
				Valid: true,
			},
		},
	); err != nil {
		return fmt.Errorf("create auth session: %w", err)
	}

	if err := qtx.UpdateUserLastLogin(ctx, input.UserID); err != nil {
		return fmt.Errorf("update user last login: %w", err)
	}

	if err := tx.Commit(ctx); err != nil {
		return fmt.Errorf("commit login session: %w", err)
	}

	return nil
}

func (r *Repository) GetUserForLogin(
	ctx context.Context,
	email string,
) (dbsqlc.GetActiveUserByEmailRow, error) {
	return r.queries.GetActiveUserByEmail(ctx, email)
}

func (r *Repository) GetUserForMe(
	ctx context.Context,
	userID uuid.UUID,
) (dbsqlc.GetActiveUserByIDRow, error) {
	return r.queries.GetActiveUserByID(ctx, userID)
}

func (r *Repository) ListUserWorkspaces(
	ctx context.Context,
	userID uuid.UUID,
) ([]dbsqlc.ListUserWorkspacesRow, error) {
	return r.queries.ListUserWorkspaces(ctx, userID)
}

func (r *Repository) GetActiveSession(
	ctx context.Context,
	sessionID uuid.UUID,
) (dbsqlc.GetActiveAuthSessionRow, error) {
	return r.queries.GetActiveAuthSession(ctx, sessionID)
}

func (r *Repository) RotateSession(
	ctx context.Context,
	sessionID uuid.UUID,
	currentHash string,
	newHash string,
) error {
	_, err := r.queries.RotateAuthSession(
		ctx,
		dbsqlc.RotateAuthSessionParams{
			SessionID:               sessionID,
			CurrentRefreshTokenHash: currentHash,
			NewRefreshTokenHash:     newHash,
		},
	)

	return err
}

func (r *Repository) RevokeSession(
	ctx context.Context,
	sessionID uuid.UUID,
) error {
	return r.queries.RevokeAuthSession(ctx, sessionID)
}
