import DwollaV2 from "dwolla-v2";

export const dwollaClient = new DwollaV2.Client({
  key: process.env.DWOLLA_KEY || "",
  secret: process.env.DWOLLA_SECRET || "",
  environment: "sandbox",
});
