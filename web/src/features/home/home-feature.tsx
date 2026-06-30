import { HomePage } from "@/components/pages/home-page";
import { useAuthStore } from "@/stores/use-auth-store";

export function HomeFeature() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return <HomePage isAuthenticated={isAuthenticated} />;
}
