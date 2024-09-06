"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { dwollaTransactionDetails } from "@/lib/userActions/bankActions/bankActions";
import { ArrowDownIcon, ArrowUpIcon, MoreHorizontal } from "lucide-react";
import { useEffect } from "react";
import { useToast } from "../ui/use-toast";

const recentTransactions = [
  {
    id: 1,
    type: "incoming",
    amount: 500.0,
    currency: "USD",
    date: "2023-06-01",
    from: "John Doe",
    to: "Me",
    status: "Completed",
  },
  {
    id: 2,
    type: "outgoing",
    amount: 250.5,
    currency: "USD",
    date: "2023-05-30",
    from: "Me",
    to: "Jane Smith",
    status: "Pending",
  },
  {
    id: 3,
    type: "incoming",
    amount: 1000.0,
    currency: "EUR",
    date: "2023-05-28",
    from: "Company XYZ",
    to: "Me",
    status: "Completed",
  },
  {
    id: 4,
    type: "outgoing",
    amount: 75.25,
    currency: "GBP",
    date: "2023-05-25",
    from: "Me",
    to: "Service Provider",
    status: "Completed",
  },
  {
    id: 5,
    type: "incoming",
    amount: 300.0,
    currency: "USD",
    date: "2023-05-22",
    from: "Client ABC",
    to: "Me",
    status: "Completed",
  },
];

export default function Transactions() {
  const { toast } = useToast();

  const getAllTransactions = async () => {
    try {
      const response = await dwollaTransactionDetails();
      if (response.status === "Success") {
        console.log(response);
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="hidden sm:table-cell">From</TableHead>
                <TableHead className="hidden sm:table-cell">To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    {transaction.type === "incoming" ? (
                      <ArrowDownIcon className="h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowUpIcon className="h-4 w-4 text-red-500" />
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {transaction.amount.toFixed(2)} {transaction.currency}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {transaction.date}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {transaction.from}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {transaction.to}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        transaction.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">More options</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
