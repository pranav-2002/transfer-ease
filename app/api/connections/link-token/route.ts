import { plaidClient } from "@/lib/plaid";
import { NextRequest, NextResponse } from "next/server";
import { CountryCode, Products } from "plaid";
import { errorHelper } from "../../helpers/errorHelpers";
import { successHelper } from "../../helpers/successHelper";

export const POST = async (req: NextRequest) => {
  const user = await req.json();

  if (!user) {
    return errorHelper("Bad request (Invalid User Object)", 400);
  }

  try {
    const tokenParams = {
      user: {
        client_user_id: user.userId.toString(),
      },
      client_name: "Transfer Ease",
      products: ["auth"] as Products[],
      language: "en",
      country_codes: ["US"] as CountryCode[],
      client_id: process.env.PLAID_CLIENT_ID,
      secret: process.env.PLAID_SECRET,
    };

    const response = await plaidClient.linkTokenCreate(tokenParams);

    return successHelper(response.data.link_token, 200);
  } catch (error) {
    console.log(error);
    return errorHelper(error, 500);
  }
};
