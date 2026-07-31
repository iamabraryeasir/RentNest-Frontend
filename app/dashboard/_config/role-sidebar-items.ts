import {
  CreditCard,
  Folder,
  GitPullRequest,
  Home,
  LayoutDashboard,
  PlusCircle,
  Users,
} from "lucide-react";
import React from "react";

export interface SidebarItem {
  text: string;
  path: string;
  icon: React.ComponentType<any>;
}

export const roleSidebarItems: Record<string, SidebarItem[]> = {
  tenant: [
    {
      text: "Dashboard",
      path: "/dashboard/tenant",
      icon: LayoutDashboard,
    },
    {
      text: "Browse Properties",
      path: "/properties",
      icon: Home,
    },
    {
      text: "My Requests",
      path: "/dashboard/tenant/requests",
      icon: GitPullRequest,
    },
  ],

  landlord: [
    {
      text: "Dashboard",
      path: "/dashboard/landlord",
      icon: LayoutDashboard,
    },
    {
      text: "Add Property",
      path: "/dashboard/landlord/properties/new",
      icon: PlusCircle,
    },
    {
      text: "Rental Requests",
      path: "/dashboard/landlord/requests",
      icon: GitPullRequest,
    },
  ],

  admin: [
    {
      text: "Dashboard",
      path: "/dashboard/admin",
      icon: LayoutDashboard,
    },
    {
      text: "Categories",
      path: "/dashboard/admin/categories",
      icon: Folder,
    },
    {
      text: "Moderate Properties",
      path: "/dashboard/admin/properties",
      icon: Home,
    },
    {
      text: "Rental Requests",
      path: "/dashboard/admin/requests",
      icon: GitPullRequest,
    },
    {
      text: "Manage Users",
      path: "/dashboard/admin/users",
      icon: Users,
    },
  ],
};
