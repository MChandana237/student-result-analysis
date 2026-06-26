import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type UserRole = "admin" | "student";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  semester?: number;
  avatar?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<AuthUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const STORAGE_KEY = "sras_auth_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
      if (raw) setUser(JSON.parse(raw));
    } catch {}
    setLoading(false);
  }, []);

  const login = async (email: string, _password: string, role: UserRole) => {
    await new Promise((r) => setTimeout(r, 400));
    const newUser: AuthUser =
      role === "admin"
        ? {
            id: "ADM001",
            name: "Dr. Anita Sharma",
            email,
            role: "admin",
          }
        : {
            id: "STU2024001",
            name: "Rohan Mehta",
            email,
            role: "student",
            department: "Computer Science",
            semester: 5,
          };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    window.localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
