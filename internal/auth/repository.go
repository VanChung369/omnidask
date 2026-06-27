package auth

import (
	"context"
	"fmt"
	dbsqlc "omnidask/db/sqlc"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository struct {
	pool    *pgxpool.Pool
	queries *dbsqlc.Queries
}

type CreateRegistrationInput struct {
	Email         string
	DisplayName   string
	PasswordHash  string
	WorkspaceName string
	WorkspaceSlug string
	Timezone      string
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

	if err := tx.Commit(ctx); err != nil {
		return RegistrationResult{}, fmt.Errorf("commit registration: %w", err)
	}

	return RegistrationResult{
		User:      user,
		Workspace: workspace,
	}, nil
}
