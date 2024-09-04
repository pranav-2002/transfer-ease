export const createLinkToken = async (user: any) => {
  const getToken = await fetch("/api/connections/link-token", {
    method: "POST",
    body: JSON.stringify(user),
  });

  const response = await getToken.json();
  return response.data;
};

export const createExchangeToken = async (publicToken: string, user: any) => {
  const getExchangeToken = await fetch("/api/connections/link-bank-account", {
    method: "POST",
    body: JSON.stringify({
      publicToken: publicToken,
      user: user,
    }),
  });
  const response = await getExchangeToken.json();
  return response;
};
