import { AxiosResponse } from "axios";
import { dwollaClient } from "./dwolla";
import { AuthGetResponse, ProcessorTokenCreateResponse } from "plaid";

export const createDwollaCustomer = async (user: any) => {
  const customerData = {
    firstName: user.first_name.trim(),
    lastName: user.last_name.trim(),
    email: user.email,
    type: "personal",
    address1: user.address,
    city: user.city,
    state: user.state,
    postalCode: user.postalCode,
    dateOfBirth: user.dateOfBirth,
    ssn: user.ssn,
  };

  const response = await dwollaClient.post("customers", customerData);
  const customerLink = response.headers.get("location");
  const customerId = customerLink?.split("/")[4];
  return customerId;
};

// Add funding source
export const addFundingSource = async (
  customerId: string | undefined,
  response: AxiosResponse<AuthGetResponse, any>,
  processor_token: AxiosResponse<ProcessorTokenCreateResponse, any>
) => {
  const account = response.data.accounts[0];

  const fundingSourceData = {
    name: account.name,
    plaidToken: processor_token.data.processor_token,
  };

  const res = await dwollaClient.post(
    `customers/${customerId}/funding-sources`,
    fundingSourceData
  );
  const fundingSourceLink = res.headers.get("location");
  const fundingSourceId = fundingSourceLink?.split("/")[4];
  return fundingSourceId;
};
