import { Toaster as Sonner, type ToasterProps } from "sonner";

import { useTheme } from "@/providers/theme-provider";

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
