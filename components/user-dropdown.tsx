"use client"

import * as React from "react"
import Link from "next/link"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { logoutAction } from "@/app/auth/_actions/logout"
import { User, LogOut, LayoutDashboard } from "lucide-react"

interface UserDropdownProps {
  user: {
    email?: string
    role?: string
  }
}

export function UserDropdown({ user }: UserDropdownProps) {
  const [isPending, startTransition] = React.useTransition()

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction()
    })
  }

  // Capitalize role for a clean display
  const displayRole = user.role 
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1) 
    : "User"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button 
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-border bg-muted text-muted-foreground outline-none transition-all hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="User menu"
          />
        }
      >
        <User className="size-5" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 p-2 bg-card border border-border shadow-lg rounded-xl">
        <div className="px-2.5 py-2 text-xs border-b border-border mb-1">
          <p className="font-semibold text-foreground truncate">{user.email || "Authenticated User"}</p>
          <p className="text-muted-foreground mt-0.5 font-medium">{displayRole}</p>
        </div>

        <DropdownMenuItem
          render={
            <Link 
              href="/dashboard" 
              className="flex w-full items-center gap-2 px-2.5 py-2 rounded-md hover:bg-muted text-sm text-foreground transition-colors cursor-pointer"
            />
          }
        >
          <LayoutDashboard className="size-4 text-muted-foreground" />
          <span>Go to Dashboard</span>
        </DropdownMenuItem>

        <DropdownMenuItem 
          onClick={handleLogout}
          disabled={isPending}
          className="flex w-full items-center gap-2 px-2.5 py-2 rounded-md hover:bg-destructive/10 text-sm text-destructive hover:text-destructive transition-colors cursor-pointer focus:bg-destructive/10 focus:text-destructive"
        >
          <LogOut className="size-4" />
          <span>{isPending ? "Logging out..." : "Log Out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
