import prisma from "@/db";
import { dwollaClient } from "@/lib/dwolla";
import { addFundingSource, createDwollaCustomer } from "@/lib/dwollaActions";
import { plaidClient } from "@/lib/plaid";
import { NextRequest, NextResponse } from "next/server";
import {
  ItemPublicTokenExchangeRequest,
  ProcessorTokenCreateRequestProcessorEnum,
} from "plaid";

export const POST = async (req: NextRequest) => {
  // Get data from body
  const { publicToken, user } = await req.json();

  // Variable for deleting customer incase of an error
  let deleteCustomerOnErrorId: any = "";

  const exchangeData: ItemPublicTokenExchangeRequest = {
    public_token: publicToken,
    client_id: process.env.PLAID_CLIENT_ID,
    secret: process.env.PLAID_SECRET,
  };
  try {
    // Get Access Token
    const response = await plaidClient.itemPublicTokenExchange(exchangeData);
    const { access_token } = response.data;

    // Create Dowlla Customer
    const customerId = await createDwollaCustomer(user);
    deleteCustomerOnErrorId = customerId;

    // Adding funding source
    const authResponse = await plaidClient.authGet({
      // To get account details
      access_token: access_token,
      client_id: process.env.PLAID_CLIENT_ID,
      secret: process.env.PLAID_SECRET,
    });

    // Getting account data
    const accountData = authResponse.data.accounts[0];

    // Creating processor token
    const processorToken = await plaidClient.processorTokenCreate({
      access_token: access_token,
      account_id: authResponse.data.accounts[0].account_id,
      processor: ProcessorTokenCreateRequestProcessorEnum.Dwolla,
      client_id: process.env.PLAID_CLIENT_ID,
      secret: process.env.PLAID_SECRET,
    });

    // Getting funding source id
    const fundingSourceId = await addFundingSource(
      customerId,
      authResponse,
      processorToken
    );

    // Store the Funding Source ID and Access Token in the DB
    const saveTokens = await prisma.accounts.create({
      data: {
        user_id: user.userId,
        account_id: accountData.account_id,
        available_balance: accountData.balances.available || 0,
        current_balance: accountData.balances.current || 0,
        iso_currency_code: accountData.balances.iso_currency_code || "USD",
        account_name: accountData.name,
        account_official_name: accountData.official_name || "",
        account_type: accountData.type,
        access_token: access_token,
        funding_sourceId: fundingSourceId || "",
        customer_id: customerId || "",
      },
    });

    if (saveTokens) {
      return NextResponse.json({
        message: "Bank Account Linked Successfully",
        accountData,
      });
    }
  } catch (error) {
    console.log(error);
    dwollaClient.post(`customers/${deleteCustomerOnErrorId}`, {
      status: "deactivated",
    });
    return NextResponse.json({
      error: error,
    });
  }
};
