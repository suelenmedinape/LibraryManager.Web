import { UserRole } from "@/shared/enums/user-role";

export interface User {
  id: number;
  fullName: string;
  email: string;
  cpf: string;
  birthDate: Date;
  role: UserRole;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCreateResponse {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

export interface UserFilter {
  name?: string;
  role?: UserRole;
}

export interface UserUpdateRequest {
  fullName?: string;
  email?: string;
  birthDate?: Date;
  role?: UserRole;
  password?: string;
}

export type UserBasicResponse = Pick<User, "id" | "fullName" | "email">;

export type UserCreateRequest = Omit<User, "id" | "createdAt" | "updatedAt">;

export type UserInfoResponse = Omit<User, "password">;

export type UserLoginRequest = Pick<User, "email" | "password">;
