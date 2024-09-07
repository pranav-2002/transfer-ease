"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { dwollaTransactionDetails } from "@/lib/userActions/bankActions/bankActions";
import { useEffect, useState } from "react";
import { useToast } from "../ui/use-toast";
import DataTable from "./table/data-table";
import { columns } from "./table/columns";

export default function Transactions() {
  interface Transaction {
    id: string;
    status: string;
    amount: {
      value: string;
    };
    individualAchId?: string;
    _links: [];
  }

  const { toast } = useToast();

  const [transactionsData, setTransactions] = useState<Transaction[]>([]);
  const [userCustomerId, setUserCustomerId] = useState("");

  const getAllTransactions = async () => {
    try {
      const response = await dwollaTransactionDetails();
      if (response.status === "Success") {
        setTransactions(response.data?.transactions);
        setUserCustomerId(response.data?.userCustomerId as string);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch transactions, please try again later",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllTransactions();
  }, []);

  const filteredTransactionData = transactionsData.filter(
    (transaction) => !transaction.individualAchId
  );

  return (
    <div className="p-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            Your latest financial activities on Transfer Ease
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredTransactionData}
            userCustomerId={userCustomerId}
          />
        </CardContent>
      </Card>
    </div>
  );
}
