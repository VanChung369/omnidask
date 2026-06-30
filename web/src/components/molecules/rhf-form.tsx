import { Form } from "@/components/atoms/form";
import { ComponentProps } from "react";
import { FieldValues, SubmitHandler, UseFormReturn } from "react-hook-form";

interface RHFFormProps<T extends FieldValues> extends Omit<ComponentProps<"form">, "onSubmit"> {
  form: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
}

export function RHFForm<T extends FieldValues>({ form, onSubmit, children, ...props }: RHFFormProps<T>) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} {...props}>
        {children}
      </form>
    </Form>
  );
}
