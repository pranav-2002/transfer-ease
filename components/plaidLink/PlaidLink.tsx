"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  PlaidLinkOnSuccess,
  PlaidLinkOptions,
  usePlaidLink,
} from "react-plaid-link";
import { useToast } from "../ui/use-toast";
import { createExchangeToken, createLinkToken } from "@/lib/plaidActions";
import { useSession } from "next-auth/react";
import { ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const PlaidLink = () => {
  const router = useRouter();

  // Get Session Data
  const { data: session } = useSession();
  const user = session?.user;

  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");

  // Get link token
  const getLinkToken = async () => {
    if (session) {
      setLoading(true);
      try {
        const data = await createLinkToken(user);
        setToken(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
        toast({
          title: "Error creating Link Token",
          variant: "destructive",
        });
      }
    }
  };

  useEffect(() => {
    getLinkToken();
  }, [session]);

  // Plaid Link Token
  const config: PlaidLinkOptions = {
    token: token,
    onSuccess: useCallback<PlaidLinkOnSuccess>(
      async (public_token: string) => {
        setLoading(true);
        try {
          const response = await createExchangeToken(public_token, user);
          toast({
            title: "Account linked successfully",
          });
          setLoading(false);
          router.push("/my-account");
        } catch (error) {
          console.log(error);
          setLoading(false);
          toast({
            title: "Something went wrong",
            variant: "destructive",
          });
        }
      },
      [user]
    ),
    onExit: () => {
      toast({
        title: "Something went wrong",
        variant: "destructive",
      });
    },
  };

  const { open, ready } = usePlaidLink(config);

  return (
    <div>
      {loading ? (
        <Button disabled className="w-full">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting....
        </Button>
      ) : (
        <Button
          className="inline-flex items-center justify-center"
          onClick={() => open()}
          disabled={!ready}
        >
          {session ? "Connect Bank Account" : "Please Login First"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default PlaidLink;
