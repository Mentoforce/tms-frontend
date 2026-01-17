"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import NotificationTable from "@/components/admin/notifications/NotificationTable";
import { NotificationItem } from "@/types/notification";

export default function NotificationsPage() {
  const [data, setData] = useState<NotificationItem[]>([]);
  const fetchNotifications = async () => {
    const res = await api.get("/notifications/admin");
    console.log(res.data.data);
    setData(res.data.data);
  };
  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Notifications</h1>
      <NotificationTable data={data} onRefresh={fetchNotifications} />
    </div>
  );
}
