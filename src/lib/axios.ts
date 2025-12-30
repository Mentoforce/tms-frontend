import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + "/api/v1",
  withCredentials: true, // future-proof
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const orgCode = localStorage.getItem("org_code");

    if (orgCode) config.headers["x-organisation-code"] = orgCode;
  }

  return config;
});

export default api;
