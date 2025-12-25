import Z from "zod";

const phoneRegex = /^\+?[1-9]\d{7,14}$/;

export const createUserZodSchema = Z.object({
  name: Z.string("Name must be a string")
    .min(3, "Name must be at least 3 characters long")
    .max(50, "Name must be at most 50 characters long"),
  email: Z.string("Email must be a string")
    .email("Invalid email")
    .min(3, "Email must be at least 3 characters long")
    .max(50, "Email must be at most 50 characters long"),
  password: Z.string("Password must be a string")
    .min(6, "Password must be at least 6 characters long")
    .max(40, "Password must be at most 40 characters long"),
  phone: Z.string("Phone must be a string")
    .regex(phoneRegex, "Invalid phone number")
    .optional(),
  address: Z.string("Address must be a string")
    .min(3, "Address must be at least 3 characters long")
    .max(50, "Address must be at most 50 characters long")
    .optional(),
});
