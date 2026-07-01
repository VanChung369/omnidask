import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/atoms/form";
import { Input } from "@/components/atoms/input";
import { Button } from "@/components/atoms/button";
import { ComponentProps } from "react";
import { cn } from "@/lib/utils";

interface RHFPasswordInputProps extends ComponentProps<typeof Input> {
  name: string;
  label?: string;
  description?: string;
  showPasswordLabel: string;
  hidePasswordLabel: string;
}

export function RHFPasswordInput({
  name,
  label,
  description,
  className,
  required,
  showPasswordLabel,
  hidePasswordLabel,
  ...props
}: RHFPasswordInputProps) {
  const { control } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel required={required}>{label}</FormLabel>}
          <FormControl>
            <div className="relative">
              <Input
                {...field}
                {...props}
                required={required}
                type={showPassword ? "text" : "password"}
                className={cn("pr-10", className)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="sr-only">
                  {showPassword ? hidePasswordLabel : showPasswordLabel}
                </span>
              </Button>
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
