"use server";

import prisma from "@/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export const userAccountDetails = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return {
      status: "Error",
      message: "No active session found",
    };
  }

  try {
    const accountDetails = await prisma.accounts.findMany({
      where: {
        user_id: session.user.id,
      },
    });

    if (accountDetails.length === 0) {
      return {
        status: "Error",
        message: "No accounts linked to the user",
      };
    }

    return {
      status: "Success",
      message: "Account details fetched",
      data: {
        ...accountDetails[0],
        user_name:
          session.user.first_name.trim() + " " + session.user.last_name.trim(),
        dateOfBirth: session.user.dateOfBirth,
      },
    };
  } catch (error) {
    console.error("Failed to retrieve account details", error);
    return {
      status: "Error",
      message: "Failed to retrieve account details",
    };
  }
};
