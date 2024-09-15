import prisma from "@/db";
import { dwollaClient } from "@/lib/dwolla";
import { NextRequest, NextResponse } from "next/server";
import { successHelper } from "../../helpers/successHelper";
import { errorHelper } from "../../helpers/errorHelpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const POST = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json();
  const { sourceAccountId, destinationAccountId, amount, description } = body;

  const requestBody = {
    _links: {
      source: {
        href: `https://api-sandbox.dwolla.com/funding-sources/${sourceAccountId}`,
      },
      destination: {
        href: `https://api-sandbox.dwolla.com/funding-sources/${destinationAccountId}`,
      },
    },
    amount: {
      currency: "USD",
      value: amount,
    },
  };

  let transactionId = "";

  try {
    // Making the Dwolla transaction
    const response = await dwollaClient.post("transfers", requestBody);
    transactionId = response.headers.get("location")?.split("/")[4] as string;

    // Perform database transaction
    await prisma.$transaction(async (tx) => {
      // Fetch sender's account with balance check
      const senderAccount = await tx.accounts.findUnique({
        where: {
          funding_sourceId: sourceAccountId,
        },
      });

      if (!senderAccount) {
        return errorHelper("Your funding source ID is invalid", 409);
      }
      if (senderAccount.available_balance < amount) {
        return errorHelper("Insufficient Balance", 409);
      }

      // Decrement sender's balance
      await tx.accounts.update({
        data: {
          available_balance: {
            decrement: Number(amount),
          },
        },
        where: {
          funding_sourceId: sourceAccountId,
        },
      });

      // Fetch and update the receiver's account
      const receiverAccount = await tx.accounts.update({
        data: {
          available_balance: {
            increment: Number(amount),
          },
        },
        where: {
          funding_sourceId: destinationAccountId,
        },
      });

      if (!receiverAccount) {
        return errorHelper("Receiver account does not exist", 402);
      }

      // Create transaction record
      await tx.transactions.create({
        data: {
          transfer_id: transactionId,
          amount: Number(amount),
          description,
          source_user_id: senderAccount.user_id,
          destination_user_id: receiverAccount.user_id,
        },
      });
    });

    return successHelper(`${amount} successfully transferred to user`, 200);
  } catch (error) {
    console.error(error);
    // Cancel Dwolla transfer if transaction failed
    if (transactionId) {
      try {
        await dwollaClient.post(`/transfers/${transactionId}`, {
          status: "cancelled",
        });
      } catch (error) {
        console.error("Failed to cancel Dwolla transaction", error);
      }
    }
    return errorHelper(error, 500);
  }
};
