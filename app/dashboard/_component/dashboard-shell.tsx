"use client";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { UserDropdown } from "@/components/user-dropdown";
import { cn } from "@/lib/utils";
import { ChevronRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { roleSidebarItems } from "../_config/role-sidebar-items";

interface DashboardShellProps {
  children: React.ReactNode;
  user: {
    id?: string;
    email?: string;
    role?: string;
  };
  role: string;
}

export function DashboardShell({ children, user, role }: DashboardShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const sidebarItems = roleSidebarItems[role] || [];
  const displayRole = role.charAt(0).toUpperCase() + role.slice(1);

  const sidebarContent = (
    <>
      <div className="space-y-6">
        {/* Logo and branding inside the sidebar */}
        <div className="px-6 h-16 flex items-center justify-between border-b border-border/55">
          <Link href="/" className="flex items-center gap-2">
            <Logo iconSize={26} className="text-xl font-bold" />
          </Link>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden size-8 cursor-pointer"
          >
            <X className="size-4" />
          </Button>
        </div>

        {/* Navigation Section */}
        <div className="px-4 space-y-2">
          <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 mb-2">
            Navigation
          </p>
          <nav className="space-y-1">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={cn(
                    "group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 select-none cursor-pointer outline-none",
                    isActive
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        "size-5 transition-colors",
                        isActive
                          ? "text-primary"
                          : "text-muted-foreground group-hover:text-foreground",
                      )}
                    />
                    <span>{item.text}</span>
                  </div>
                  <ChevronRight
                    className={cn(
                      "size-4 opacity-0 transition-all duration-150 group-hover:opacity-100 group-hover:translate-x-0.5",
                      isActive
                        ? "opacity-100 text-primary translate-x-0.5"
                        : "text-muted-foreground",
                    )}
                  />
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-muted/20 flex">
      {/* Desktop Sidebar (Fixed Left Column) */}
      <aside className="hidden md:flex w-64 border-r border-border bg-card flex-col justify-between py-2 h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-card flex flex-col justify-between py-2 h-screen transition-transform duration-300 md:hidden",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay Backdrop */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-background/55 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Main Area (Right Column) */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Navigation (Only on Right Column) */}
        <header className="sticky top-0 z-30 border-b border-border bg-card/85 backdrop-blur-md h-16 flex items-center justify-between px-6 sm:px-8">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Toggle Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden cursor-pointer bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Toggle sidebar"
            >
              <Menu className="size-5" />
            </Button>
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {displayRole} Portal
            </span>
          </div>

          <div className="flex items-center gap-4">
            {user && <UserDropdown user={user} />}
          </div>
        </header>

        {/* Content Viewport */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
