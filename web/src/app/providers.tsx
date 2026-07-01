import type { ReactNode } from "react";

import { Toaster } from "@/shared/ui/primitives/sonner";
import { ThemeProvider } from "@/shared/providers/theme-provider";
import { QueryProvider } from "@/shared/api/query-client";

import { AuthBootstrap } from "./bootstrap/auth-bootstrap";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="omnidask-theme">
      <QueryProvider>
        <AuthBootstrap>
          {children}
          <Toaster />
        </AuthBootstrap>
      </QueryProvider>
    </ThemeProvider>
  );
}
