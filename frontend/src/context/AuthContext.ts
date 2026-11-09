import { createContext } from "react";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  created_at?: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  refreshUser: () => Promise<AuthUser | null>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<
  AuthContextValue | undefined
>(undefined);