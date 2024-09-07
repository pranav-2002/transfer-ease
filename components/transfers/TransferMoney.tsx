"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { DollarSign, Send, CreditCard, User, FileText } from "lucide-react";
import axios from "axios";

export default function TransferMoney() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    sourceFundingSourceId: "",
    destinationFundingSourceId: "",
    note: "",
  });
  const [errors, setErrors] = useState({
    amount: "",
    sourceFundingSourceId: "",
    destinationFundingSourceId: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      amount: "",
      sourceFundingSourceId: "",
      destinationFundingSourceId: "",
    };

    if (
      !formData.amount ||
      isNaN(parseFloat(formData.amount)) ||
      parseFloat(formData.amount) <= 0
    ) {
      newErrors.amount = "Please enter a valid amount greater than 0.";
      isValid = false;
    }
    if (!formData.sourceFundingSourceId) {
      newErrors.sourceFundingSourceId = "Your Funding ID is required.";
      isValid = false;
    }
    if (!formData.destinationFundingSourceId) {
      newErrors.destinationFundingSourceId =
        "Recipient's Funding ID is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);

      try {
        const body = {
          amount: formData.amount,
          sourceAccountId: formData.sourceFundingSourceId,
          destinationAccountId: formData.destinationFundingSourceId,
          description: formData.note,
        };
        const response = await axios.post(
          "api/transfers/transfer-amount",
          body
        );
        if (response) {
          toast({
            title: "Transfer Initiated",
            description: `$${formData.amount} sent to user successfully`,
          });
        }
        setIsLoading(false);
        setFormData({
          amount: "",
          sourceFundingSourceId: "",
          destinationFundingSourceId: "",
          note: "",
        });
      } catch (error) {
        console.log(error);
        setIsLoading(false);
        toast({
          title: "Transfer Failed",
          description: "Please try again later",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
              Transfer Money
            </h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700"
                >
                  Amount (USD)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    name="amount"
                    id="amount"
                    className="pl-10"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={handleInputChange}
                  />
                </div>
                {errors.amount && (
                  <p className="mt-2 text-sm text-red-600">{errors.amount}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="sourceFundingSourceId"
                  className="block text-sm font-medium text-gray-700"
                >
                  Your Funding ID
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CreditCard className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    name="sourceFundingSourceId"
                    id="sourceFundingSourceId"
                    className="pl-10"
                    placeholder="Enter your Funding ID"
                    value={formData.sourceFundingSourceId}
                    onChange={handleInputChange}
                  />
                </div>
                {errors.sourceFundingSourceId && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.sourceFundingSourceId}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="destinationFundingSourceId"
                  className="block text-sm font-medium text-gray-700"
                >
                  Recipient Funding Source ID
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CreditCard className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    name="destinationFundingSourceId"
                    id="destinationFundingSourceId"
                    className="pl-10"
                    placeholder="Enter recipient's Funding ID"
                    value={formData.destinationFundingSourceId}
                    onChange={handleInputChange}
                  />
                </div>
                {errors.destinationFundingSourceId && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.destinationFundingSourceId}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="note"
                  className="block text-sm font-medium text-gray-700"
                >
                  Note (Optional)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <Textarea
                    name="note"
                    id="note"
                    className="pl-10"
                    placeholder="Add a note for this transfer"
                    value={formData.note}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                <Send className="mr-2 h-4 w-4" />
                {isLoading ? "Processing..." : "Transfer Money"}
              </Button>
            </form>
          </div>
        </div>
      </main>
      <Toaster />
    </div>
  );
}
