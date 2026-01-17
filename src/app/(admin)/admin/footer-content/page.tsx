"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import FooterTable from "@/components/admin/footer/FooterTable";

export default function FooterContentPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchFooter = async () => {
    try {
      const res = await api.get("/admin/footer");
      setData(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFooter();
  }, []);

  if (loading) {
    return <div className="p-6 text-gray-400">Loading footer content…</div>;
  }

  return (
    <div className="p-1">
      <h1 className="text-xl font-semibold mb-6">Footer Content</h1>
      <FooterTable data={data} onRefresh={fetchFooter} />
    </div>
  );
}
