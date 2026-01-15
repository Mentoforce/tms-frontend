import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { NotificationItem } from "@/types/notification";

export function useNotifications() {
  const [queue, setQueue] = useState<NotificationItem[]>([]);
  const [current, setCurrent] = useState<NotificationItem | null>(null);

  useEffect(() => {
    api.get("/notifications").then((res) => {
        console.log("PUBLIC NOTIFICATIONS 👉", res.data);
      const dismissed = JSON.parse(
        localStorage.getItem("dismissed_notifications") || "[]"
      );

      const filtered = res.data.filter(
        (n: NotificationItem) => !dismissed.includes(n._id)
      );

      setQueue(filtered);
      setCurrent(filtered[0] || null);
    });
  }, []);

  const dismiss = () => {
    if (!current) return;

    const dismissed = JSON.parse(
      localStorage.getItem("dismissed_notifications") || "[]"
    );
    localStorage.setItem(
      "dismissed_notifications",
      JSON.stringify([...dismissed, current._id])
    );

    const remaining = queue.slice(1);
    setQueue(remaining);
    setCurrent(remaining[0] || null);
  };

  return { current, dismiss };
}
