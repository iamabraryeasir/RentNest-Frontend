"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertCircle, Check, Key, User } from "lucide-react";

interface RegisterRoleSelectorProps {
  selectedRole: "TENANT" | "LANDLORD" | "";
  setSelectedRole: (role: "TENANT" | "LANDLORD") => void;
  isRegistering: boolean;
  errors?: string[];
}

export function RegisterRoleSelector({
  selectedRole,
  setSelectedRole,
  isRegistering,
  errors,
}: RegisterRoleSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-foreground">
        I want to register as a:
      </label>

      <input type="hidden" name="role" value={selectedRole} />

      <div className="grid grid-cols-2 gap-4 pt-1">
        {/* Tenant Card */}
        <Button
          type="button"
          variant="outline"
          onClick={() => setSelectedRole("TENANT")}
          disabled={isRegistering}
          className={cn(
            "relative flex items-center justify-between p-3.5 rounded-xl h-auto text-left font-normal transition-all duration-200 cursor-pointer select-none border border-border w-full shadow-none",
            selectedRole === "TENANT"
              ? "border-primary bg-primary/5 hover:bg-primary/5 hover:text-foreground"
              : "hover:border-primary/50 hover:bg-muted/40 hover:text-foreground",
          )}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${
                selectedRole === "TENANT"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <User className="size-5" />
            </div>
            <span className="font-semibold text-foreground text-sm">
              Tenant
            </span>
          </div>
          {selectedRole === "TENANT" ? (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
              <Check className="size-3" />
            </span>
          ) : (
            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-border bg-background" />
          )}
        </Button>

        {/* Landlord Card */}
        <Button
          type="button"
          variant="outline"
          onClick={() => setSelectedRole("LANDLORD")}
          disabled={isRegistering}
          className={cn(
            "relative flex items-center justify-between p-3.5 rounded-xl h-auto text-left font-normal transition-all duration-200 cursor-pointer select-none border border-border w-full shadow-none",
            selectedRole === "LANDLORD"
              ? "border-primary bg-primary/5 hover:bg-primary/5 hover:text-foreground"
              : "hover:border-primary/50 hover:bg-muted/40 hover:text-foreground",
          )}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${
                selectedRole === "LANDLORD"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <Key className="size-5" />
            </div>
            <span className="font-semibold text-foreground text-sm">
              Landlord
            </span>
          </div>
          {selectedRole === "LANDLORD" ? (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
              <Check className="size-3" />
            </span>
          ) : (
            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-border bg-background" />
          )}
        </Button>
      </div>

      {errors?.map((message) => (
        <p
          key={message}
          className="text-sm text-destructive flex items-center gap-1 mt-1 font-medium"
        >
          <AlertCircle className="size-4" /> {message}
        </p>
      ))}
    </div>
  );
}
