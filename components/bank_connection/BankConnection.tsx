import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, DollarSign, Lock } from "lucide-react";
import PlaidLink from "@/components/plaidLink/PlaidLink";

export default function BankConnection() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Welcome to Transfer Ease
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  The simplest way to transfer money between your accounts.
                  Connect your bank and start transferring today.
                </p>
              </div>
              <div className="space-x-4">
                <PlaidLink />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              Why Connect Your Bank?
            </h2>
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <Card>
                <CardHeader>
                  <CheckCircle2 className="h-10 w-10 mb-4 text-green-500" />
                  <CardTitle>Easy Transfers</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Quickly move money between your accounts with just a few
                    clicks.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Lock className="h-10 w-10 mb-4 text-blue-500" />
                  <CardTitle>Secure Connection</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Your data is encrypted and protected with bank-level
                    security.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <DollarSign className="h-10 w-10 mb-4 text-yellow-500" />
                  <CardTitle>Save Money</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Avoid fees by transferring money directly between your
                    accounts.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
