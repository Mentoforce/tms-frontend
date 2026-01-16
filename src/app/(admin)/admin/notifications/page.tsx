// "use client";

// import { useEffect, useState } from "react";
// import api from "@/lib/axios";
// import NotificationTable from "@/components/admin/notifications/NotificationTable";

// export default function NotificationsPage() {
//   const [data, setData] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     api.get("/admin/notifications").then((res) => {
//       setData(res.data);
//       setLoading(false);
//     });
//   }, []);

//   if (loading) {
//     return <div className="p-6 text-gray-400">Loading notifications…</div>;
//   }

//   return (
//     <div className="p-6">
//       <h1 className="text-xl font-semibold mb-2">Notifications Management</h1>
//       <p className="text-sm text-gray-400 mb-6">
//         Manage and publish system notifications.
//       </p>

//       <NotificationTable data={data} />
//     </div>
//   );
// }

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
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-6">Notifications</h1>
      <NotificationTable data={data} onRefresh={fetchNotifications} />
    </div>
  );
}
