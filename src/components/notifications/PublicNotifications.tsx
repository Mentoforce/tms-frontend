"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import NotificationToast from "./NotificationToast";
import { PublicNotification } from "./NotificationTypes";

export default function PublicNotifications({
  primarycolor,
}: {
  primarycolor?: string;
}) {
  const [items, setItems] = useState<PublicNotification[]>([]);

  useEffect(() => {
    api.get("/notifications").then((res) => {
      setItems(res.data || []);
    });
  }, []);

  if (!items.length) return null;

  return (
    <div className="fixed top-6 right-6 z-[9999] space-y-4 max-w-sm">
      {items.map((n) => (
        <NotificationToast key={n._id} data={n} primarycolor={primarycolor} />
      ))}
    </div>
  );
}
