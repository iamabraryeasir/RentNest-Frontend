"use client";

import { registerAction, type RegisterState } from "@/app/auth/_actions/register";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Logo } from "@/components/logo";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { User, Key, Check, AlertCircle } from "lucide-react";

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

  // Client-side states for interactive features
  const [selectedRole, setSelectedRole] = useState<"TENANT" | "LANDLORD" | "">("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [clientErrors, setClientErrors] = useState<{ confirmPassword?: string[] }>({});

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
        <Link href="/">
          <Logo iconSize={40} className="text-2xl font-bold" />
        </Link>
      </div>
      <Card className="w-full border-border bg-card/65 backdrop-blur-md shadow-xl rounded-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Create account</CardTitle>
          <CardDescription>
            Join RentNest today to find your dream home or manage listings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} onSubmit={handleSubmit} className="space-y-5">
            {/* Account Type (Role) Selector */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">
                I want to register as a:
              </label>
              
              <input type="hidden" name="role" value={selectedRole} />
              
              <div className="grid grid-cols-2 gap-4 pt-1">
                {/* Tenant Card */}
                <button
                  type="button"
                  onClick={() => setSelectedRole("TENANT")}
                  className={`relative flex items-center justify-between p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring select-none ${
                    selectedRole === "TENANT"
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-border hover:border-primary/50 hover:bg-muted/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${selectedRole === "TENANT" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                      <User className="size-5" />
                    </div>
                    <span className="font-semibold text-foreground text-sm">Tenant</span>
                  </div>
                  {selectedRole === "TENANT" ? (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
                      <Check className="size-3" />
                    </span>
                  ) : (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full border border-border bg-background" />
                  )}
                </button>

                {/* Landlord Card */}
                <button
                  type="button"
                  onClick={() => setSelectedRole("LANDLORD")}
                  className={`relative flex items-center justify-between p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring select-none ${
                    selectedRole === "LANDLORD"
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-border hover:border-primary/50 hover:bg-muted/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${selectedRole === "LANDLORD" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                      <Key className="size-5" />
                    </div>
                    <span className="font-semibold text-foreground text-sm">Landlord</span>
                  </div>
                  {selectedRole === "LANDLORD" ? (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
                      <Check className="size-3" />
                    </span>
                  ) : (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full border border-border bg-background" />
                  )}
                </button>
              </div>
              
              {state.errors?.role?.map((message) => (
                <p key={message} className="text-sm text-destructive flex items-center gap-1 mt-1 font-medium">
                  <AlertCircle className="size-4" /> {message}
                </p>
              ))}
            </div>

            {/* Name Input */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-sm font-medium">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="John Doe"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground/60"
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
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="john@example.com"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground/60"
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
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground/60"
                />
                {state.errors?.password?.map((message) => (
                  <p key={message} className="text-sm text-destructive mt-0.5">
                    {message}
                  </p>
                ))}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  placeholder="Repeat password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground/60"
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

            <Button type="submit" className="w-full font-semibold transition-transform active:scale-[0.98]" disabled={pending || !!clientErrors.confirmPassword}>
              {pending ? "Creating account..." : "Register"}
            </Button>
          </form>

          <div className="mt-5 flex items-center justify-between text-sm border-t border-border/60 pt-4">
            <Link
              href="/auth/login"
              className="text-primary hover:underline underline-offset-4 font-medium"
            >
              Already have an account? Sign in
            </Link>
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground hover:underline underline-offset-4 font-medium"
            >
              Go home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
