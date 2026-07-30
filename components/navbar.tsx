import { Logo } from "@/components/logo";
import { UserDropdown } from "@/components/user-dropdown";
import { getAuthenticatedUserData } from "@/lib/auth";
import { cookies } from "next/headers";
import Link from "next/link";

export async function Navbar() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  const user = getAuthenticatedUserData(token);

  return (
    <header className="w-full border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Section: Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="hover:opacity-90 transition-opacity">
            <Logo iconSize={32} />
          </Link>
        </div>

        {/* Middle Section: Navigation Items */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link
            href="/properties"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Browse Properties
          </Link>
          <Link
            href="#"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            About Us
          </Link>
          <Link
            href="#"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Contact
          </Link>
        </nav>

        {/* Right Section: Conditional Auth Rendering */}
        <div className="flex items-center gap-4">
          {user ? (
            <UserDropdown user={user} />
          ) : (
            <Link
              href="/auth/login"
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
