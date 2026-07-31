"use client";

import { loginAction, type LoginState } from "@/app/auth/_actions/login";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useActionState, useEffect, useRef } from "react";
import toast from "react-hot-toast";

import { cn } from "@/lib/utils";

const initialState: LoginState = {
  success: false,
  message: "",
  redirectTo: undefined,
};

export function LoginForm() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    loginAction,
    initialState,
  );
  const router = useRouter();
  const loadingToastId = useRef<string | undefined>(undefined);

  const isLoggingIn = pending || (state.success && !!state.redirectTo);

  useEffect(() => {
    if (pending) {
      if (!loadingToastId.current) {
        loadingToastId.current = toast.loading("Signing in...");
      }
      return;
    }

    if (loadingToastId.current) {
      toast.dismiss(loadingToastId.current);
      loadingToastId.current = undefined;
    }

    if (state.success && state.redirectTo) {
      toast.success(state.message || "Login successful");
      router.replace(state.redirectTo);
      return;
    }

    if (!state.success && state.message) {
      toast.error(state.message);
    }
  }, [pending, router, state.message, state.redirectTo, state.success]);

  return (
    <div className="flex flex-col gap-6 w-full max-w-md">
      <div className="flex justify-center">
        <Link href="/" className={cn(isLoggingIn && "pointer-events-none")}>
          <Logo iconSize={40} className="text-2xl font-bold" />
        </Link>
      </div>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>
            Use your demo credentials to access the right dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                disabled={isLoggingIn}
                placeholder="tenant@example.com"
              />
              {state.errors?.email?.map((message) => (
                <p key={message} className="text-sm text-destructive">
                  {message}
                </p>
              ))}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                disabled={isLoggingIn}
                placeholder="Enter password"
              />
              {state.errors?.password?.map((message) => (
                <p key={message} className="text-sm text-destructive">
                  {message}
                </p>
              ))}
            </div>

            {state.message && !state.success ? (
              <p className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {state.message}
              </p>
            ) : null}

            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="mt-4 flex items-center justify-between text-sm">
            <Link
              href="/auth/register"
              className={cn(
                "text-primary underline-offset-4 hover:underline",
                isLoggingIn && "pointer-events-none opacity-50",
              )}
            >
              Create an account
            </Link>
            <Link
              href="/"
              className={cn(
                "text-primary underline-offset-4 hover:underline",
                isLoggingIn && "pointer-events-none opacity-50",
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
