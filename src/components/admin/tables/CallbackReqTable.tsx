"use client";

import { Eye, Volume1Icon } from "lucide-react";
import { useState } from "react";
import Td from "./util/Td";
import Th from "./util/Th";
import { transformStatus } from "@/lib/tableUtils";
import CallbackViewModal from "./CallbackRequestModal";

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
  audio_url?: string;
};

export default function CallbackRequestTable({
  callback,
  onCallbackUpdated,
}: {
  callback: CallbackRequest[];
  onCallbackUpdated: (updatedCallback: any) => void;
}) {
  const [selectedCallback, setSelectedCallback] = useState<any>(null);

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

      <table className="w-full text-sm">
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
              <Td>
                {c.audio_url ? (
                  <span className="px-1 py-1 rounded flex w-8 bg-purple-500/15 text-purple-400 text-xs justify-around">
                    <span>
                      <Volume1Icon size={14} />{" "}
                    </span>
                    1
                  </span>
                ) : (
                  "-"
                )}
              </Td>
              <Td>
                <StatusPill status={c.status} />
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
  );
}

function StatusPill({ status }: { status: CallbackRequest["status"] }) {
  const map: Record<string, string> = {
    pending: "bg-blue-500/15 text-blue-400",
    waiting: "bg-blue-500/15 text-blue-400",
    resolved: "bg-green-500/15 text-green-400",
    rejected: "bg-red-500/15 text-red-400",
    missed: "bg-yellow-500/15 text-yellow-400",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${map[status]}`}
    >
      {transformStatus(status)}
    </span>
  );
}
