import * as z from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, { message: "Vui lòng nhập tên" }),
  email: z.string().email({ message: "Vui lòng nhập địa chỉ email hợp lệ" }),
  password: z.string().min(1, { message: "Vui lòng nhập mật khẩu" }),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
