import { useMutation } from "@tanstack/react-query";

import { authService } from "@/features/auth/api/auth.api";

export function useLoginMutation() {
  return useMutation({
    mutationFn: authService.login,
  });
}
