"use client";

import { Eye, Volume1Icon } from "lucide-react";
import { useState } from "react";
import TicketViewModal from "./TicketViewModal";
import { transformStatus } from "@/lib/tableUtils";
import Td from "./util/Td";
import Th from "./util/Th";

type Ticket = {
  _id: string;
  ticket_number: string;
  username: string;
  status: any; //"pending" | "updated" | "resolved" | "rejected";
  return_channel: string;
  createdAt: string;
  updatedAt: string;
  subject_id?: { title: string };
  sub_subject_id?: { title: string };
  files?: any[];
  audio_url?: string;
};

export default function TicketTable({
  tickets,
  onTicketUpdated,
}: {
  tickets: Ticket[];
  onTicketUpdated: (updatedTicket: any) => void;
}) {
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  if (!tickets || tickets.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 p-8 text-center text-gray-400">
        No tickets found
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 overflow-hidden">
      {selectedTicket && (
        <TicketViewModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onUpdated={(updatedTicket) => {
            onTicketUpdated(updatedTicket);
            setSelectedTicket(null);
          }}
        />
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm overflow-x-auto">
          <thead className="bg-white/5">
            <tr>
              <Th>REQUEST ID</Th>
              <Th>USER</Th>
              <Th>SUBJECT</Th>
              <Th>SITUATION</Th>
              <Th>CHANNEL</Th>
              <Th>APPENDICES</Th>
              <Th>HISTORY</Th>
              <Th>VIEW</Th>
            </tr>
          </thead>

          <tbody>
            {tickets.map((t) => (
              <tr
                key={t._id}
                className="border-t border-white/5 hover:bg-white/5 transition"
              >
                <Td className="font-medium text-white">{t.ticket_number}</Td>

                <Td className="flex items-center gap-2">
                  <span className="h-7 w-7 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs">
                    {t.username?.[0]?.toUpperCase()}
                  </span>
                  {t.username}
                </Td>

                <Td>
                  <p className="text-white">{t.subject_id?.title}</p>
                  <p className="text-xs text-gray-400">
                    {t.sub_subject_id?.title}
                  </p>
                </Td>

                <Td>
                  <StatusPill status={t.status} />
                </Td>

                <Td className="text-gray-300">{t.return_channel}</Td>

                <Td className="flex gap-2">
                  {t.files && t.files?.length > 0 && (
                    <span className="px-1 py-1 rounded bg-blue-500/15 text-blue-400 text-xs">
                      📎 {t.files.length}
                    </span>
                  )}
                  {t.audio_url && (
                    <span className="px-1 py-1 rounded flex w-8 bg-purple-500/15 text-purple-400 text-xs justify-around">
                      <span>
                        <Volume1Icon size={14} />{" "}
                      </span>
                      1
                    </span>
                  )}
                  {(!t.files || t.files?.length == 0) && !t.audio_url && "-"}
                </Td>

                <Td className="text-gray-400">
                  {new Date(t.updatedAt).toLocaleDateString()}
                </Td>

                <Td>
                  <button
                    onClick={() => setSelectedTicket(t)}
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

function StatusPill({ status }: { status: Ticket["status"] }) {
  const map: Record<string, string> = {
    pending: "bg-blue-500/15 text-blue-400",
    created: "bg-blue-500/15 text-blue-400",
    updated: "bg-purple-500/15 text-purple-400",
    resolved: "bg-green-500/15 text-green-400",
    rejected: "bg-red-500/15 text-red-400",
    files_missing: "bg-yellow-500/15 text-yellow-400",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${map[status]}`}
    >
      {transformStatus(status)}
    </span>
  );
}
