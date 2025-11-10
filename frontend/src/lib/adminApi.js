import axios from "axios";
import { getAdmin } from "./adminAuth";

export const adminApi = axios.create({
  baseURL: "/api/admin_users",
});

adminApi.interceptors.request.use((config) => {
  const admin = getAdmin();
  const t = admin?.token;
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});
