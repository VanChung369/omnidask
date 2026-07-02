import { useEffect, type ReactNode } from "react";

import { authService } from "@/features/auth/api/auth.api";
import { hasClientAuthSession } from "@/features/auth/session/auth-session-marker";
import { useAuthStore } from "@/features/auth/store/auth.store";

type AuthBootstrapProps = {
  children: ReactNode;
};

let didBootstrapAuth = false;

export function AuthBootstrap({ children }: AuthBootstrapProps) {
  const initialize = useAuthStore((state) => state.initialize);
  const setAnonymous = useAuthStore((state) => state.setAnonymous);

  useEffect(() => {
    if (didBootstrapAuth) {
      return;
    }

    if (!hasClientAuthSession()) {
      setAnonymous();
      return;
    }

    didBootstrapAuth = true;

    async function bootstrapAuth() {
      try {
        const refreshedSession = await authService.refresh();

        initialize({
          accessToken: refreshedSession.accessToken,
          user: refreshedSession.user,
          workspaces: refreshedSession.workspaces,
        });
      } catch {
        setAnonymous();
      }
    }

    void bootstrapAuth();
  }, [initialize, setAnonymous]);

  return <>{children}</>;
}
