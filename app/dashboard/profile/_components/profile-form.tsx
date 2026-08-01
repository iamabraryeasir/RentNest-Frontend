"use client";

import {
  updateProfileAction,
  type ProfileState,
} from "@/app/dashboard/_actions/profile-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Mail, Save, User } from "lucide-react";
import { useActionState, useEffect } from "react";
import toast from "react-hot-toast";

interface ProfileFormProps {
  initialUser: {
    name?: string;
    email?: string;
    role?: string;
  };
}

const initialState: ProfileState = {
  success: false,
  message: "",
};

export function ProfileForm({ initialUser }: ProfileFormProps) {
  const [state, formAction, pending] = useActionState(
    updateProfileAction,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
    } else if (!state.success && state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-6">
      {/* Name Input */}
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="text-xs font-bold uppercase tracking-wider text-foreground block"
        >
          Full Name
        </label>
        <div className="relative">
          <User className="absolute left-3.5 top-3 size-4 text-muted-foreground pointer-events-none" />
          <Input
            id="name"
            name="name"
            type="text"
            defaultValue={initialUser.name || ""}
            placeholder="Your full name"
            disabled={pending}
            className="pl-10"
          />
        </div>
        {state.errors?.name?.map((err) => (
          <p key={err} className="text-xs text-destructive font-medium mt-1">
            {err}
          </p>
        ))}
      </div>

      {/* Email Input */}
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-xs font-bold uppercase tracking-wider text-foreground block"
        >
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-3 size-4 text-muted-foreground pointer-events-none" />
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={initialUser.email || ""}
            placeholder="name@example.com"
            disabled={pending}
            className="pl-10"
          />
        </div>
        {state.errors?.email?.map((err) => (
          <p key={err} className="text-xs text-destructive font-medium mt-1">
            {err}
          </p>
        ))}
      </div>

      {/* Account Role Badge */}
      <div className="space-y-1 bg-muted/20 border border-border/50 rounded-xl p-4">
        <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider block">
          Account Role
        </span>
        <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary uppercase border border-primary/20">
          {initialUser.role || "User"}
        </span>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <Button
          type="submit"
          disabled={pending}
          className="w-full sm:w-auto cursor-pointer px-6 py-5 rounded-xl font-bold text-sm gap-2"
        >
          {pending ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Updating Profile...
            </>
          ) : (
            <>
              <Save className="size-4" /> Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
