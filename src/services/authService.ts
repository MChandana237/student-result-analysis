import { api } from "./api";
import type { UserRole } from "@/context/AuthContext";

export const authService = {
  login: (email: string, password: string, role: UserRole) =>
    api.post("/auth/login", { email, password, role }).then((r) => r.data),
  logout: () => api.post("/auth/logout").then((r) => r.data),
  me: () => api.get("/auth/me").then((r) => r.data),
};
