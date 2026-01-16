"use client";

import { useState } from "react";
import { Pen, Trash } from "lucide-react";
import api from "@/lib/axios";
import ActivePill from "@/components/ActivePill";
import NotificationModal from "./NotificationModal";
import { NotificationItem, NotificationType } from "@/types/notification";
import Th from "../tables/util/Th";
import Td from "../tables/util/Td";
import { transformStatus } from "@/lib/tableUtils";

export default function NotificationTable({
  data,
  onRefresh,
}: {
  data: NotificationItem[];
  onRefresh: () => void;
}) {
  const [editing, setEditing] = useState<NotificationItem | null>(null);
  const toggleActive = async (d: NotificationItem) => {
    await api.post("/notifications", {
      _id: d._id,
      is_active: !d.is_active,
    });
    onRefresh();
  };
  return (
    <>
      <button
        onClick={() =>
          setEditing({
            title: "",
            message: "",
            type: "info",
            is_active: true,
            start_date: "",
            end_date: "",
          })
        }
        className="btn mb-6 w-full cursor-pointer"
      >
        + Add Notification
      </button>

      {editing && (
        <NotificationModal
          initialData={editing}
          onClose={() => setEditing(null)}
          onSaved={(saved: NotificationItem) => {
            onRefresh();
          }}
        />
      )}
      <table className="w-full text-sm">
        <thead className="bg-white/5">
          <tr>
            <Th>TITLE</Th>
            <Th>TYPE</Th>
            <Th>VALIDITY</Th>
            <Th>STATUS</Th>
            <Th>ACTIONS</Th>
          </tr>
        </thead>

        <tbody>
          {data?.map((d) => (
            <tr key={d._id} className="border-t border-white/5 text-center">
              <Td>
                <div className="text-left">
                  <p className="font-medium">{d.title}</p>
                  <p className="text-xs text-gray-400">{d.message}</p>
                </div>
              </Td>
              <Td>
                <StatusPill status={d.type} />
              </Td>
              <Td>{formatValidity(d.start_date, d.end_date, d.createdAt)}</Td>
              <Td>
                <button
                  onClick={() => {
                    toggleActive(d);
                  }}
                  className="cursor-pointer"
                >
                  <ActivePill status={d.is_active} />
                </button>
              </Td>
              <Td>
                <div className="flex gap-2 justify-center">
                  <Pen
                    size={14}
                    className="cursor-pointer"
                    onClick={() => setEditing(d)}
                  />
                  <Trash
                    size={14}
                    className="cursor-pointer hover:text-red-500"
                    onClick={async () => {
                      await api.post("/notifications/delete", {
                        notification_id: d._id,
                      });
                      onRefresh();
                    }}
                  />
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function StatusPill({ status }: { status: NotificationType }) {
  const map: Record<string, string> = {
    success: "bg-green-500/15 text-green-400",
    info: "bg-blue-500/15 text-blue-400",
    warning: "bg-yellow-500/15 text-yellow-400",
    error: "bg-red-500/15 text-red-400",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${map[status]}`}
    >
      {transformStatus(status)}
    </span>
  );
}

const formatValidity = (start?: string, end?: string, created?: string) => {
  if (!start && !end) return "No Validity";

  const s = start
    ? new Date(start).toLocaleDateString("en-IN")
    : created
    ? new Date(created).toLocaleDateString("en-IN")
    : "";

  const e = end ? new Date(end).toLocaleDateString("en-IN") : "Infinity";

  return `${s} - ${e}`;
};
