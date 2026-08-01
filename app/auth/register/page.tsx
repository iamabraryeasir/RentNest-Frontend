import type { Metadata } from "next";
import { RegisterForm } from "./register-form";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Register for a new RentNest tenant or landlord account.",
};

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <RegisterForm />
    </main>
  );
}
