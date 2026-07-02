import { useMutation } from "@tanstack/react-query";

import { authService } from "@/features/auth/api/auth.api";

export function useRegisterMutation() {
  return useMutation({
    mutationFn: authService.register,
  });
}
