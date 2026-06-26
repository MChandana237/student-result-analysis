import { api } from "./api";

export const adminService = {
  getDashboardStats: () => api.get("/admin/stats").then((r) => r.data),
  addStudent: (data: Record<string, unknown>) => api.post("/admin/students", data).then((r) => r.data),
  uploadExcel: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return api.post("/admin/upload", form, { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data);
  },
  getResults: (params?: Record<string, unknown>) => api.get("/admin/results", { params }).then((r) => r.data),
  deleteResult: (id: string) => api.delete(`/admin/results/${id}`).then((r) => r.data),
  getToppers: () => api.get("/admin/toppers").then((r) => r.data),
};
