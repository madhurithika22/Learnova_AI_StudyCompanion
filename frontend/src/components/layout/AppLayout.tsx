import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { AppSidebar } from "./AppSidebar";
import { AppNavbar } from "./AppNavbar";
import { MobileNav } from "./MobileNav";
import { SidebarProvider } from "@/components/ui/sidebar";

export function AppLayout() {
  const { isAuthenticated } = useUser();

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full gradient-bg">
        {/* Animated background blobs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-blob animation-delay-4000" />
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <AppSidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen">
          <AppNavbar />
          <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6 overflow-auto">
            <Outlet />
          </main>
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
          <MobileNav />
        </div>
      </div>
    </SidebarProvider>
  );
}
