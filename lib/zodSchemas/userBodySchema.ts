import { z } from "zod";

export const userBodySchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .email({ message: "Invalid email address" }),
  first_name: z
    .string({ message: "First name is required" })
    .max(50, { message: "First name must be 50 characters or less" }),
  last_name: z
    .string({ message: "Last name is required" })
    .max(50, { message: "Last name must be 50 characters or less" }),
  address: z
    .string({ message: "Address is required" })
    .max(200, { message: "Address must be 200 characters or less" }),
  city: z
    .string({ message: "City is required" })
    .max(15, { message: "City must be 15 characters or less" }),
  state: z
    .string({ message: "State is required" })
    .toUpperCase()
    .length(2, { message: "State must be 2 characters" }),
  postalCode: z
    .string({ message: "Postal code is required" })
    .length(5, { message: "Postal code must be 5 characters" }),
  dateOfBirth: z.string({ message: "Date of birth is required" }).length(10, {
    message: "Date of birth must be in the format YYYY-MM-DD",
  }),
  ssn: z
    .string({ message: "SSN is required" })
    .length(4, { message: "SSN must be 4 characters" }),
  password: z
    .string({ message: "Password is required" })
    .min(5, { message: "Password must be at least 8 characters long" }),
  phoneNumber: z
    .string({ message: "Phone number is required" })
    .length(10, { message: "Phone number must be 10 digits" }),
});
