import {
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { AuthContext, type AuthUser } from "./AuthContext";
import apiRequest from "../services/api";

type AuthProviderProps = {
  children: ReactNode;
};

async function fetchCurrentUser(): Promise<AuthUser | null> {
  try {
    const data = await apiRequest<{ user: AuthUser }>("/auth/me");
    return data.user;
  } catch {
    return null;
  }
}

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    setIsLoading(true);

    const currentUser = await fetchCurrentUser();

    setUser(currentUser);
    setIsLoading(false);

    return currentUser;
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiRequest<{ message: string }>("/auth/logout", {
        method: "POST",
      });
    } finally {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    let isActive = true;

    const checkSession = async () => {
      const currentUser = await fetchCurrentUser();

      if (isActive) {
        setUser(currentUser);
        setIsLoading(false);
      }
    };

    void checkSession();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        refreshUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;