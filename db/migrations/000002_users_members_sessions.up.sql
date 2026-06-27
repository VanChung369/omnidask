CREATE TABLE
    users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        email CITEXT NOT NULL UNIQUE,
        display_name TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        avatar_url TEXT,
        status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
        last_login_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now (),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now ()
    );

CREATE TRIGGER trg_users_updated_at BEFORE
UPDATE ON users FOR EACH ROW EXECUTE FUNCTION set_updated_at ();

CREATE TABLE
    workspace_members (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        workspace_id UUID NOT NULL REFERENCES workspaces (id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
        role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'supervisor', 'agent')),
        status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'invited', 'disabled')),
        created_at TIMESTAMPTZ NOT NULL DEFAULT now (),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now (),
        UNIQUE (workspace_id, user_id)
    );

CREATE TRIGGER trg_workspace_members_updated_at BEFORE
UPDATE ON workspace_members FOR EACH ROW EXECUTE FUNCTION set_updated_at ();

CREATE TABLE
    auth_sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
        refresh_token_hash TEXT NOT NULL UNIQUE,
        user_agent TEXT,
        ip_address INET,
        expires_at TIMESTAMPTZ NOT NULL,
        revoked_at TIMESTAMPTZ,
        last_used_at TIMESTAMPTZ NOT NULL DEFAULT now (),
        created_at TIMESTAMPTZ NOT NULL DEFAULT now ()
    );

CREATE INDEX idx_workspace_members_user ON workspace_members (user_id);

CREATE INDEX idx_workspace_members_workspace_role ON workspace_members (workspace_id, role);

CREATE INDEX idx_auth_sessions_active_user ON auth_sessions (user_id, expires_at DESC)
WHERE
    revoked_at IS NULL;