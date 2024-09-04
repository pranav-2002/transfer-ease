import prisma from "@/db";
import { dwollaClient } from "@/lib/dwolla";
import { NextRequest, NextResponse } from "next/server";
import { successHelper } from "../../helpers/successHelper";
import { errorHelper } from "../../helpers/errorHelpers";

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const {
    sourceAccountId,
    destinationAccountId,
    amount,
    customerId,
    description,
  } = body;

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
    fees: [
      {
        _links: {
          "charge-to": {
            href: `https://api-sandbox.dwolla.com/customers/${customerId}`,
          },
        },
        amount: {
          value: "0.1",
          currency: "USD",
        },
      },
    ],
  };

  // Reference variable in case of error
  let transactionId = "";

  try {
    // Making a dwolla transaction
    const response = await dwollaClient.post("transfers", requestBody);

    // Making the DB transaction
    prisma.$transaction(async (tx) => {
      const senderAccount = await tx.accounts.update({
        data: {
          available_balance: {
            decrement: Number(amount),
          },
        },
        where: {
          funding_sourceId: sourceAccountId,
        },
      });

      if ((senderAccount?.available_balance as number) < amount) {
        return errorHelper("Insufficient Balance", 409);
      }

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

      const transaction = await tx.transactions.create({
        data: {
          transfer_id: response.headers
            .get("location")
            ?.split("/")[4] as string,
          amount: Number(amount),
          description: description,
        },
      });

      transactionId = response.headers.get("location")?.split("/")[4] as string;
    });
    return successHelper(`${amount} successfully transferred to user`, 200);
  } catch (error) {
    console.log(error);
    dwollaClient.post(`/transfers/${transactionId}`, { status: "cancelled" });
    return errorHelper(error, 500);
  }
};
