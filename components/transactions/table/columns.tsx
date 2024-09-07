"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

const determineTransferDirection = (
  transactionObject: any,
  userCustomerId: any
) => {
  if (
    transactionObject.source.href ===
    `https://api-sandbox.dwolla.com/customers/${userCustomerId}`
  ) {
    return (
      <span className="flex items-center">
        Debit
        <ArrowDownIcon className="h-4 w-4 ml-2 text-red-500" />
      </span>
    );
  } else {
    return (
      <span className="flex items-center">
        Credit
        <ArrowUpIcon className="h-4 w-4 ml-1 text-green-500" />
      </span>
    );
  }
};

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "_links",
    header: "Type",
    cell: (props) => {
      const { row } = props;
      const { userCustomerId } = props as any;
      return determineTransferDirection(row.getValue("_links"), userCustomerId);
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amountObj: any = row.getValue("amount");
      const amount = parseFloat(amountObj.value);
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return formatted;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            row.getValue("status") === "processed"
              ? "bg-green-100 text-green-800"
              : row.getValue("status") === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.getValue("status")}
        </span>
      );
    },
  },
  {
    accessorKey: "created",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("created"));
      return date.toLocaleString();
    },
  },
  {
    accessorKey: "id",
    header: "Transaction Id",
  },
];
