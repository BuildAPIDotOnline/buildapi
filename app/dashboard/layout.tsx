import React from "react";
import DashboardHeader from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/SideBar";
import BottomNav from "@/components/dashboard/BottomNav";
import DashboardGate from "@/components/dashboard/DashboardGate";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardGate>
      <div className="flex min-h-screen bg-[#FAFAFA]">
        <Sidebar />
        <div className="flex-1 min-w-0">
          <DashboardHeader />
          <main className="p-4 md:p-8 pb-20 md:pb-8">
            {children}
          </main>
        </div>
        <BottomNav />
      </div>
    </DashboardGate>
  );
}