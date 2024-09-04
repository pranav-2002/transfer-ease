"use server";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export const transferFunds = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return {
      status: "Error",
      message: "No active session found",
    };
  }
};
