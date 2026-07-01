import { Toaster as Sonner, type ToasterProps } from "sonner";

import { useTheme } from "@/shared/providers/theme-context";

function Toaster(props: ToasterProps) {
  const { theme } = useTheme();

  return (
    <Sonner
      theme={theme}
      richColors
      closeButton
      position="top-center"
      {...props}
    />
  );
}

export { Toaster };
