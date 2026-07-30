import { NextRequest, NextResponse } from "next/server";

const roleDashboards: Record<string, string> = {
  tenant: "/dashboard/tenant",
  landlord: "/dashboard/landlord",
  admin: "/dashboard/admin",
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = request.cookies.get("role")?.value;

  if (pathname === "/dashboard") {
    if (!role || !roleDashboards[role]) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", "/dashboard");
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.redirect(new URL(roleDashboards[role], request.url));
  }

  if (pathname.startsWith("/dashboard/")) {
    const requestedRole = pathname.split("/")[2];

    if (!role || !roleDashboards[role]) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (requestedRole && requestedRole !== role && roleDashboards[role]) {
      const redirectUrl = new URL(roleDashboards[role], request.url);
      redirectUrl.searchParams.set(
        "toast",
        `You do not have access to the ${requestedRole} dashboard. You were redirected to your own dashboard.`,
      );
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/dashboard"],
};
