"use client";
import DashboardCharts from "@/components/admin/dashboard/DashboardChart";
import RecentList from "@/components/admin/dashboard/RecentList";
import StatsGrid from "@/components/admin/dashboard/StatsGrid";
import api from "@/lib/axios";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>({});
  const [recent, setRecent] = useState({
    tickets: [],
    bonusClaims: [],
    callbacks: [],
  });
  useEffect(() => {
    async function callAPI() {
      const res = await api.get("/dashboard");
      const { stats, recent } = res.data.data;
      setStats(stats);
      setRecent(recent);
    }
    callAPI();
  }, []);

  return (
    <div className="space-y-8">
      <StatsGrid stats={stats} />
      <DashboardCharts />
      <div className="grid md:grid-cols-3 gap-6">
        <RecentList
          title="Recent Tickets"
          items={recent.tickets}
          render={(t) => (
            <li key={t._id} className="text-sm text-gray-400">
              {t.ticket_number} — {t.status}
            </li>
          )}
        />

        <RecentList
          title="Recent Bonus Claims"
          items={recent.bonusClaims}
          render={(b) => (
            <li key={b._id} className="text-sm text-gray-400">
              {b.username} — {b.status}
            </li>
          )}
        />

        <RecentList
          title="Recent Callbacks"
          items={recent.callbacks}
          render={(c) => (
            <li key={c._id} className="text-sm text-gray-400">
              {c.username || c.phone}- {c.createdAt}
            </li>
          )}
        />
      </div>
    </div>
  );
}
