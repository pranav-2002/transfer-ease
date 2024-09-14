"use server";

import prisma from "@/db";
import { userBodySchema } from "../zodSchemas/userBodySchema";
import { hash } from "bcrypt-ts";

export const userSignUp = async (userData: object) => {
  const { success, error, data } = userBodySchema.safeParse(userData);

  // Zod Validation
  if (!success) {
    console.log(error);
    return {
      status: "Error",
      message: "Bad Request",
    };
  }

  try {
    // Check if existing user
    const user = await prisma.user.findUnique({ where: { email: data.email } });

    if (user) {
      return {
        status: "Error",
        message: "Email already registered",
      };
    }

    // Register new user
    const hashedPassword = await hash(data.password, 10);
    const newUser = await prisma.user.create({
      data: { ...data, password: hashedPassword },
    });
    if (newUser) {
      return {
        status: "Success",
        message: "Registration Successful. Please Login",
      };
    }
  } catch (error) {
    console.log(error);
    return {
      status: "Error",
      message: "Internal Server Error",
    };
  }
};

// Get user by params
// export const getUserDetailsFromAccount = async (fundingSourceId: string) => {
//   try {
//     const userDetails = await prisma.accounts.findUnique({
//       where: {
//         funding_sourceId: fundingSourceId,
//       },
//       select: {
//         user: {
//           select: {
//             first_name: true,
//             last_name: true,
//           },
//         },
//       },
//     });
//     return userDetails?.user.first_name + " " + userDetails?.user.last_name;
//   } catch (error) {
//     console.log(error);
//     return "Error";
//   }
// };
