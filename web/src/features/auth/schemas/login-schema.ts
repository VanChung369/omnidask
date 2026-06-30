import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Vui lòng nhập địa chỉ email hợp lệ" }),
  password: z.string().min(1, { message: "Vui lòng nhập mật khẩu" }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
