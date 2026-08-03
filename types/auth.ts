export type UserRole = "ADMIN" | "LANDLORD" | "TENANT";

export type UserStatus = "ACTIVE" | "BLOCKED";

export interface AuthenticatedUser {
  id?: string;
  email?: string;
  name?: string;
  role?: string;
  status?: string;
  sub?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole | string;
  status: UserStatus | string;
  createdAt?: string;
  updatedAt?: string;
}

export type LoginState = {
  success: boolean;
  message: string;
  redirectTo?: string;
  errors?: {
    email?: string[];
    password?: string[];
  };
};

export type RegisterState = {
  success: boolean;
  message: string;
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    role?: string[];
  };
};

export type ProfileState = {
  success: boolean;
  message: string;
  errors?: {
    name?: string[];
    email?: string[];
  };
};
