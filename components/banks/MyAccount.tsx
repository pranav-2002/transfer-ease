"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Check, CreditCard } from "lucide-react";
import { userAccountDetails } from "@/lib/userActions/bankActions/bankActions";
import { useToast } from "../ui/use-toast";

export default function MyAccount() {
  const { toast } = useToast();

  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [accountInfo, setAccountInfo] = useState({
    user_name: "",
    account_name: "",
    account_official_name: "",
    account_type: "",
    available_balance: "",
    current_balance: "",
    customer_id: "",
    funding_sourceId: "",
    dateOfBirth: "",
  });

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  const getAccountData = async () => {
    setLoading(true);
    const response = await userAccountDetails();
    if (response.status === "Success") {
      if (response.data) {
        setAccountInfo(response.data as any);
      }
      toast({
        title: response.status,
        description: response.message,
      });
      setLoading(false);
    } else {
      toast({
        title: response.status,
        description: response.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    getAccountData();
  }, []);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-8">My Account</h1>
      <Card className="w-full max-w-md mx-auto bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-8">
            <CreditCard className="h-10 w-10" />
            <p className="text-lg font-semibold">Transfer Ease</p>
          </div>
          <div className="space-y-4">
            <p className="text-2xl font-bold">
              {accountInfo.account_name} (Platinum Card)
            </p>
            <div className="flex justify-between">
              <div>
                <p className="text-xs uppercase">Card Holder</p>
                <p className="font-semibold">{accountInfo.user_name}</p>
              </div>
              <div>
                <p className="text-xs uppercase">Expires</p>
                <p className="font-semibold">12/28</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full max-w-md mx-auto mt-8">
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input id="dob" value={accountInfo.dateOfBirth} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountType">Account Sub Type</Label>
              <Input
                id="accountType"
                value={accountInfo.account_type}
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="availableBalance">Available Balance</Label>
              <Input
                id="availableBalance"
                value={`$${accountInfo.available_balance}`}
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentBalance">Current Balance</Label>
              <Input
                id="currentBalance"
                value={`$${accountInfo.current_balance}`}
                readOnly
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="customerId">Account Name</Label>
            <div className="flex">
              <Input
                id="customerId"
                value={accountInfo.account_official_name}
                readOnly
                className="rounded-r-none"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="customerId">Customer ID</Label>
            <div className="flex">
              <Input
                id="customerId"
                value={accountInfo.customer_id}
                readOnly
                className="rounded-r-none"
              />
              <Button
                variant="outline"
                className="rounded-l-none"
                onClick={() =>
                  copyToClipboard(accountInfo.customer_id, "customerId")
                }
              >
                {copiedField === "customerId" ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fundingSourceId">Funding Source ID</Label>
            <div className="flex">
              <Input
                id="fundingSourceId"
                value={accountInfo.funding_sourceId}
                readOnly
                className="rounded-r-none"
              />
              <Button
                variant="outline"
                className="rounded-l-none"
                onClick={() =>
                  copyToClipboard(
                    accountInfo.funding_sourceId,
                    "fundingSourceId"
                  )
                }
              >
                {copiedField === "fundingSourceId" ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
