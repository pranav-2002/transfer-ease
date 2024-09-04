"use client";
import RecoilProvider from "./RecoilProvider";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/toaster";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <RecoilProvider>
      <SessionProvider>{children}</SessionProvider>
      <Toaster />
    </RecoilProvider>
  );
};

export default Providers;
