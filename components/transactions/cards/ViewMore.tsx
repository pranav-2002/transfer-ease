import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getDwollaCustomerInformation } from "@/lib/userActions/bankActions/bankActions";
import { CreditCard } from "lucide-react";
import { useState } from "react";

interface ViewMoreProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  data: {
    _links: any;
    amount: {
      value: string;
      currency: string;
    };
    created: Date;
    status: string;
  };
}

export default function ViewMore({ isOpen, setIsOpen, data }: ViewMoreProps) {
  const [destinationName, setDestinationName] = useState("");
  const [sourceName, setSourceName] = useState("");

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-center">
            <div
              className={
                data.status === "processed"
                  ? `p-4 rounded-full bg-green-100`
                  : `p-4 rounded-full bg-yellow-100`
              }
            >
              <CreditCard
                className={
                  data.status === "processed"
                    ? `h-8 w-8 text-green-600`
                    : `h-8 w-8 text-yellow-600`
                }
              />
            </div>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">
              {"$"} {data.amount.value}
            </p>
            <p className="text-sm text-gray-500">
              {new Date(data.created).toLocaleString()}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold">From</p>
              {sourceName === "" && (
                <button
                  onClick={async () => {
                    setSourceName("loading...");
                    const response = await getDwollaCustomerInformation(
                      data._links.source.href.split("/")[4]
                    );
                    setSourceName(response?.data);
                  }}
                >
                  Reveal
                </button>
              )}
              <p className="text-gray-600">{sourceName}</p>
            </div>
            <div>
              <p className="font-semibold">To</p>
              {destinationName === "" && (
                <button
                  onClick={async () => {
                    setDestinationName("loading...");
                    const response = await getDwollaCustomerInformation(
                      data._links.destination.href.split("/")[4]
                    );
                    setDestinationName(response?.data);
                  }}
                >
                  Reveal
                </button>
              )}
              <p className="text-gray-600">{destinationName}</p>
            </div>
            <div>
              <p className="font-semibold">Source Funding ID</p>
              <p className="text-gray-600">
                {data._links["source-funding-source"]?.href?.split("/")[4]}
              </p>
            </div>
            <div>
              <p className="font-semibold">Destination Funding ID</p>
              <p className="text-gray-600">
                {data._links["destination-funding-source"]?.href?.split("/")[4]}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center text-sm text-gray-500">
            <p className="mt-2 font-semibold">
              This transaction is {data.status}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
