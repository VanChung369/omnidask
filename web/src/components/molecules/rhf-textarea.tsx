import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/atoms/form";
import { Textarea } from "@/components/atoms/textarea";
import { ComponentProps } from "react";

interface RHFTextareaProps extends ComponentProps<typeof Textarea> {
  name: string;
  label?: string;
  description?: string;
}

export function RHFTextarea({ name, label, description, ...props }: RHFTextareaProps) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Textarea {...field} {...props} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
