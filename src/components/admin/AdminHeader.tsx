"use client";

import { useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function AdminHeader() {
  const router = useRouter();

  const logout = async () => {
    await api.post("/logout");
    router.replace("/admin/login");
  };

  return (
    <header className="h-14 bg-slate-900 shadow flex items-center justify-end px-6">
      <button onClick={logout} className="btn-danger">
        Logout
      </button>
    </header>
  );
}
