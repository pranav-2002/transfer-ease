"use client";

import { useState } from "react";

import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  MoreHorizontal,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import ViewMore from "../cards/ViewMore";

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
    header: ({ column }) => {
      return (
        <div
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === "asc");
          }}
          className="flex items-center"
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
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
  {
    id: "actions",
    accessorKey: "_links",
    header: "Details",
    cell: function Cell({ row }) {
      const [isOpen, setIsOpen] = useState(false);

      type viewMoreData = {
        _links: object;
        amount: {
          value: string;
          currency: string;
        };
        created: Date;
        status: string;
      };

      const data: viewMoreData = {
        _links: row.getValue("_links"),
        amount: row.original.amount,
        created: row.original.created,
        status: row.original.status,
      };

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setIsOpen(true)}
                className="cursor-pointer"
              >
                View more
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ViewMore isOpen={isOpen} setIsOpen={setIsOpen} data={data} />
        </>
      );
    },
  },
];
