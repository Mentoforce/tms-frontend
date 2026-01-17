"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/me")
      .then(() => setLoading(false))
      .catch(() => router.replace("/admin/login"));
  }, [router]);

  if (loading) {
    return <div className="p-6">Checking admin access...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <AdminSidebar />
      <div className="md:ml-64 flex flex-col min-h-screen">
        <AdminHeader />
        <main className="p-6 pt-20 md:pt-6">{children}</main>
      </div>
    </div>
  );
}
