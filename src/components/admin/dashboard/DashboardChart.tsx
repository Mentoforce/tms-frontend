"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import DaysFilter from "./DaysFilter";
import { chartTypes } from "../../../mockdata/chart-config";
import api from "@/lib/axios";

export default function DashboardCharts() {
  const [days, setDays] = useState(7);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api
      .get(`/dashboard-charts?days=${days}`)
      .then((res) => setData(res.data.data));
  }, [days]);

  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Activity</h2>
        <DaysFilter days={days} onChange={setDays} />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {chartTypes.map((chart) => (
          <div
            key={chart.key}
            className="rounded-xl border border-white/10 p-4 bg-gray-900"
          >
            <p className="mb-3 text-sm text-gray-400">{chart.label}</p>

            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data[chart.key]}>
                {/* X AXIS */}
                <XAxis
                  dataKey="date"
                  stroke="#9CA3AF"
                  tick={{ fill: "#9CA3AF", fontSize: 12 }}
                  axisLine={{ stroke: "#374151" }}
                  tickLine={{ stroke: "#374151" }}
                />

                {/* Y AXIS */}
                <YAxis
                  stroke="#9CA3AF"
                  tick={{ fill: "#9CA3AF", fontSize: 12 }}
                  axisLine={{ stroke: "#374151" }}
                  tickLine={{ stroke: "#374151" }}
                />

                {/* TOOLTIP */}
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111827",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#9CA3AF" }}
                  itemStyle={{ color: "#E5E7EB" }}
                />

                {/* LINE */}
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke={chart.color}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </div>
  );
}
