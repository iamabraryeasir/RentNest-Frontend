import jwt from "jsonwebtoken";

export type AuthenticatedUser = {
  id?: string;
  email?: string;
  name?: string;
  role?: string;
  status?: string;
  sub?: string;
};

export function getApiBaseUrl() {
  return process.env.API_BASE_URL;
}

export function getAuthenticatedUserData(token: string | null | undefined) {
  if (!token) {
    return null;
  }

  const decoded = jwt.decode(token) as Record<string, unknown> | null;

  if (!decoded) {
    return null;
  }

  return {
    id: decoded.id as string | undefined,
    email: decoded.email as string | undefined,
    role: (decoded.role as string | undefined)?.toLowerCase(),
  };
}
