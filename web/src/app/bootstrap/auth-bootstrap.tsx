import { useEffect, type ReactNode } from "react";

import { authService } from "@/features/auth/api/auth.api";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { setApiAccessToken } from "@/shared/api/http";

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

    didBootstrapAuth = true;

    async function bootstrapAuth() {
      try {
        const refreshedSession = await authService.refresh();
        setApiAccessToken(refreshedSession.accessToken);

        const currentSession = await authService.me();

        initialize({
          accessToken: refreshedSession.accessToken,
          user: currentSession.user,
          workspaces: currentSession.workspaces,
        });
      } catch {
        setAnonymous();
      }
    }

    void bootstrapAuth();
  }, [initialize, setAnonymous]);

  return <>{children}</>;
}
