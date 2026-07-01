import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/atoms/form";
import { Textarea } from "@/shared/ui/atoms/textarea";
import { ComponentProps } from "react";

interface RHFTextareaProps extends ComponentProps<typeof Textarea> {
  name: string;
  label?: string;
  description?: string;
}

export function RHFTextarea({ name, label, description, required, ...props }: RHFTextareaProps) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel required={required}>{label}</FormLabel>}
          <FormControl>
            <Textarea {...field} required={required} {...props} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
