"use client";

import { registerAction } from "@/app/auth/_actions/register";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { RegisterState } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { RegisterRoleSelector } from "./register-role-selector";

const initialState: RegisterState = {
  success: false,
  message: "",
};

export function RegisterForm() {
  const [state, formAction, pending] = useActionState<RegisterState, FormData>(
    registerAction,
    initialState,
  );
  const router = useRouter();
  const loadingToastId = useRef<string | undefined>(undefined);

  const isRegistering = pending || state.success;

  // Client-side states for interactive features
  const [selectedRole, setSelectedRole] = useState<"TENANT" | "LANDLORD" | "">(
    "",
  );
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [clientErrors, setClientErrors] = useState<{
    confirmPassword?: string[];
  }>({});

  useEffect(() => {
    if (pending) {
      if (!loadingToastId.current) {
        loadingToastId.current = toast.loading("Creating your account...");
      }
      return;
    }

    if (loadingToastId.current) {
      toast.dismiss(loadingToastId.current);
      loadingToastId.current = undefined;
    }

    if (state.success) {
      toast.success(state.message || "Registration successful!");
      const timer = setTimeout(() => {
        router.push("/auth/login");
      }, 1500);
      return () => clearTimeout(timer);
    }

    if (!state.success && state.message) {
      toast.error(state.message);
    }
  }, [pending, router, state.message, state.success]);

  // Client-side confirm password check in real-time
  useEffect(() => {
    if (confirmPassword && password !== confirmPassword) {
      setClientErrors({ confirmPassword: ["Passwords do not match."] });
    } else {
      setClientErrors({});
    }
  }, [password, confirmPassword]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (!selectedRole) {
      event.preventDefault();
      toast.error("Please select an account type (Tenant or Landlord).");
      return;
    }
    if (password !== confirmPassword) {
      event.preventDefault();
      toast.error("Passwords do not match.");
      return;
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-lg">
      <div className="flex justify-center">
        <Link href="/" className={cn(isRegistering && "pointer-events-none")}>
          <Logo iconSize={40} className="text-2xl font-bold" />
        </Link>
      </div>
      <Card className="w-full border-border bg-card/65 backdrop-blur-md shadow-xl rounded-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Sign up</CardTitle>
          <CardDescription>
            Create an account to start renting or hosting.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action={formAction}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <RegisterRoleSelector
              selectedRole={selectedRole}
              setSelectedRole={setSelectedRole}
              isRegistering={isRegistering}
              errors={state.errors?.role}
            />

            {/* Name Input */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-sm font-medium">
                Full Name
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                disabled={isRegistering}
                placeholder="John Doe"
              />
              {state.errors?.name?.map((message) => (
                <p key={message} className="text-sm text-destructive mt-0.5">
                  {message}
                </p>
              ))}
            </div>

            {/* Email Input */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                disabled={isRegistering}
                placeholder="john@example.com"
              />
              {state.errors?.email?.map((message) => (
                <p key={message} className="text-sm text-destructive mt-0.5">
                  {message}
                </p>
              ))}
            </div>

            {/* Password Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  disabled={isRegistering}
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {state.errors?.password?.map((message) => (
                  <p key={message} className="text-sm text-destructive mt-0.5">
                    {message}
                  </p>
                ))}
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium"
                >
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  disabled={isRegistering}
                  placeholder="Repeat password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {clientErrors.confirmPassword?.map((message) => (
                  <p key={message} className="text-sm text-destructive mt-0.5">
                    {message}
                  </p>
                ))}
              </div>
            </div>

            {state.message && !state.success ? (
              <p className="rounded-lg border border-destructive/20 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive font-medium">
                {state.message}
              </p>
            ) : null}

            <Button
              type="submit"
              className="w-full font-semibold transition-transform active:scale-[0.98] cursor-pointer"
              disabled={isRegistering || !!clientErrors.confirmPassword}
            >
              {isRegistering
                ? state.success
                  ? "Redirecting..."
                  : "Creating account..."
                : "Register"}
            </Button>
          </form>

          <div className="mt-5 flex items-center justify-between text-sm border-t border-border/60 pt-4">
            <Link
              href="/auth/login"
              className={cn(
                "text-primary hover:underline underline-offset-4 font-medium",
                isRegistering && "pointer-events-none opacity-50",
              )}
            >
              Already have an account? Sign in
            </Link>
            <Link
              href="/"
              className={cn(
                "text-muted-foreground hover:text-foreground hover:underline underline-offset-4 font-medium",
                isRegistering && "pointer-events-none opacity-50",
              )}
            >
              Go home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
