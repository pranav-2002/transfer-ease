"use server";

import prisma from "@/db";
import { authOptions } from "@/lib/auth";
import { dwollaClient } from "@/lib/dwolla";
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

export const userBalanceDetails = async () => {
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
      select: {
        id: true,
        available_balance: true,
        current_balance: true,
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
      message: "Account balances fetched",
      data: {
        ...accountDetails[0],
        user_name: session.user.first_name.trim(),
      },
    };
  } catch (error) {
    console.error("Failed to retrieve account balace", error);
    return {
      status: "Error",
      message: "Failed to retrieve account balance",
    };
  }
};

export const transactionDetails = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return {
      status: "Error",
      message: "No active session found",
    };
  }

  try {
    const userTransactions = await prisma.transactions.findMany({
      where: {
        source_user_id: session.user.id,
      },
      select: {
        amount: true,
        created_at: true,
      },
    });

    return {
      status: "Success",
      message: "Account balances fetched",
      data: userTransactions,
    };
  } catch (error) {
    console.log("Failed to fetch transactions", error);
    return {
      status: "Error",
      message: "Failed to retrieve account balance",
    };
  }
};

export const dwollaTransactionDetails = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return {
      status: "Error",
      message: "No active session found",
    };
  }

  try {
    const userAccount = await prisma.accounts.findMany({
      where: {
        user_id: session.user.id,
      },
      select: {
        customer_id: true,
      },
    });

    if (userAccount.length === 0) {
      return {
        status: "Error",
        message: "No accounts linked to the user",
      };
    }

    // Fetch Dwolla Transactions
    const customerId = userAccount[0].customer_id;
    const transactions = await dwollaClient.get(
      `customers/${customerId}/transfers`
    );

    return {
      status: "Success",
      message: "Fetched all transactions",
      data: {
        transactions: transactions.body._embedded.transfers,
        totalCount: transactions.body.total,
      },
    };
  } catch (error) {
    console.log("Failed to fetch Dwolla Transactions", error);
    return {
      status: "Error",
      message: "Failed to retrieve Dwolla transactions",
    };
  }
};
