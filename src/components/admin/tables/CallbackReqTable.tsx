"use client";

import { Eye, Volume1Icon } from "lucide-react";
import { useState } from "react";
import Td from "./util/Td";
import Th from "./util/Th";
import { transformStatus } from "@/lib/tableUtils";
import CallbackViewModal from "./CallbackRequestModal";
import api from "@/lib/axios";

type CallbackRequest = {
  _id: string;
  phone?: string;
  username?: string;
  issue?: string;
  preferred_time: string;
  status: any; //"pending" | "updated" | "resolved" | "rejected";
  createdAt: string;
  updatedAt: string;
  remarks?: string;
  audio?: string;
};

const CALLBACK_STATUS_CLASS_MAP: Record<string, string> = {
  pending: "bg-blue-500/15 text-blue-400",
  waiting: "bg-blue-500/15 text-blue-400",
  missed: "bg-yellow-500/15 text-yellow-400",
  resolved: "bg-green-500/15 text-green-400",
  rejected: "bg-red-500/15 text-red-400",
};

export default function CallbackRequestTable({
  callback,
  onCallbackUpdated,
}: {
  callback: CallbackRequest[];
  onCallbackUpdated: (updatedCallback: any) => void;
}) {
  const [selectedCallback, setSelectedCallback] = useState<any>(null);

  const updateCallbackStatus = async (
    callback: CallbackRequest,
    newStatus: string,
  ) => {
    await api.post("/tickets/update-callback-request", {
      request_id: callback._id,
      status: newStatus,
    });

    onCallbackUpdated({
      ...callback,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    });
  };

  if (!callback || callback.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 p-8 text-center text-gray-400">
        No Callback Requests found
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 overflow-hidden">
      {selectedCallback && (
        <CallbackViewModal
          callback={selectedCallback}
          onClose={() => setSelectedCallback(null)}
          onUpdated={(updatedCallback) => {
            onCallbackUpdated(updatedCallback);
            setSelectedCallback(null);
          }}
        />
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm overflow-x-auto">
          <thead className="bg-white/5">
            <tr>
              <Th>USER</Th>
              <Th>PHONE</Th>
              <Th>REASON</Th>
              <Th>PREFERRED TIME</Th>
              <Th>AUDIO</Th>
              <Th>SITUATION</Th>
              <Th>HISTORY</Th>
              <Th>VIEW</Th>
            </tr>
          </thead>

          <tbody>
            {callback.map((c) => (
              <tr
                key={c._id}
                className="border-t border-white/5 hover:bg-white/5 transition"
              >
                <Td className="font-medium text-white">{c.username || "-"}</Td>
                <Td className="font-medium text-white">{c.phone || "-"}</Td>
                <Td className="font-medium text-white">
                  {c.issue
                    ? c.issue.length > 20
                      ? c.issue?.slice(0, 20) + "..."
                      : c.issue
                    : "-"}
                </Td>

                <Td className="font-medium text-white">{c.preferred_time}</Td>
                <Td className="text-center">
                  {c.audio ? (
                    <audio controls src={c.audio} className="w-65 h-7" />
                  ) : (
                    "-"
                  )}
                </Td>
                <Td>
                  {c.status !== "resolved" ? (
                    <CallbackStatusDropdown
                      status={c.status}
                      onChange={(newStatus) =>
                        updateCallbackStatus(c, newStatus)
                      }
                    />
                  ) : (
                    <StatusPill status={c.status} />
                  )}
                </Td>

                <Td className="text-gray-400">
                  {new Date(c.updatedAt).toLocaleDateString()}
                </Td>

                <Td>
                  <button
                    onClick={() => setSelectedCallback(c)}
                    className="text-gray-400 hover:text-white"
                  >
                    <Eye size={16} />
                  </button>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: CallbackRequest["status"] }) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${CALLBACK_STATUS_CLASS_MAP[status]}`}
    >
      {transformStatus(status)}
    </span>
  );
}

function CallbackStatusDropdown({
  status,
  onChange,
}: {
  status: string;
  onChange: (status: string) => void;
}) {
  const [open, setOpen] = useState(false);

  const STATUSES = ["pending", "waiting", "missed", "resolved", "rejected"];

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${CALLBACK_STATUS_CLASS_MAP[status]}`}
      >
        {transformStatus(status)}
        <span className="opacity-60">▾</span>
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-44 rounded-lg border border-white/10 bg-[#0B0F1A] shadow-lg">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => {
                onChange(s);
                setOpen(false);
              }}
              className="w-full text-left px-3 py-2 hover:bg-white/5 first:rounded-t-lg last:rounded-b-lg"
            >
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${CALLBACK_STATUS_CLASS_MAP[s]}`}
              >
                {transformStatus(s)}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
