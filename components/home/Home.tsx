"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, DollarSign, ArrowUpDown } from "lucide-react";

import BalanceChart from "../charts/BalanceChart";
import TransactionsChart from "../charts/TransactionsChart";
import {
  transactionDetails,
  userBalanceDetails,
} from "@/lib/userActions/bankActions/bankActions";
import React, { useEffect, useMemo, useState } from "react";
import { useToast } from "../ui/use-toast";

export default function Home() {
  const { toast } = useToast();

  interface accountData {
    id: number;
    available_balance: number;
    current_balance: number;
    user_name: string;
  }

  type transactionData = {
    amount: number;
    created_at: Date;
  }[];

  const [accountData, setAccountData] = useState<accountData>();
  const [transactionData, setTransactionsData] = useState<transactionData>();

  const getAccountData = async () => {
    const response = await userBalanceDetails();
    if (response.status === "Success" && response.data) {
      setAccountData(response.data);
    } else {
      toast({
        title: response.status,
        description: response.message,
        variant: "destructive",
      });
    }
  };

  const getTransactionsData = async () => {
    const response = await transactionDetails();
    if (response.status === "Success" && response.data) {
      setTransactionsData(response.data);
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
    getTransactionsData();
  }, []);

  const totalTransactionValue = useMemo(() => {
    return transactionData?.reduce((acc, crr) => acc + crr.amount, 0);
  }, [transactionData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <main className="container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">
          Welcome back, {accountData?.user_name}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">
                Available Balance
              </CardTitle>
              <DollarSign className="h-6 w-6 opacity-75" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                $ {accountData?.available_balance}
              </div>
              <p className="text-xs opacity-75">+2.5% from last month</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-pink-500 to-rose-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">
                Total Spent (Last 1 Week)
              </CardTitle>
              <ArrowUpDown className="h-6 w-6 opacity-75" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${totalTransactionValue}</div>
              <p className="text-xs opacity-75">65% of total balance</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">
                Credit Card Balance
              </CardTitle>
              <CreditCard className="h-6 w-6 opacity-75" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                $ {accountData?.current_balance}{" "}
              </div>
              <p className="text-xs opacity-75">35% of total balance</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-700">
                Balance Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BalanceChart
                data={{
                  balance: accountData?.available_balance as number,
                }}
              />
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-700">
                Recent Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TransactionsChart
                chartData={transactionData ? transactionData : []}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
