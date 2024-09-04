"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  HomeIcon,
  BuildingIcon,
  ClockIcon,
  ArrowRightLeftIcon,
  LinkIcon,
} from "lucide-react";

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState("Home");

  const sidebarItems = [
    { name: "Home", icon: HomeIcon, href: "/" },
    { name: "My Account", icon: BuildingIcon, href: "/my-account" },
    {
      name: "Transaction History",
      icon: ClockIcon,
      href: "/transaction-history",
    },
    {
      name: "Transfer Funds",
      icon: ArrowRightLeftIcon,
      href: "/transfer-funds",
    },
    { name: "Connect a Bank", icon: LinkIcon, href: "/connect-bank" },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="w-64 flex-shrink-0 border-r">
        <div className="flex h-full flex-col">
          <div className="p-4">
            <h2 className="text-lg font-semibold">Transfer Ease</h2>
          </div>
          <nav className="flex-1 overflow-y-auto">
            <ul className="flex flex-col gap-2 p-4">
              {sidebarItems.map((item) => (
                <li key={item.name}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start",
                      activeTab === item.name && "bg-muted font-semibold"
                    )}
                    onClick={() => setActiveTab(item.name)}
                    asChild
                  >
                    <Link href={item.href}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.name}
                    </Link>
                  </Button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-8 overflow-hidden">{children}</div>
      </main>
    </div>
  );
}
