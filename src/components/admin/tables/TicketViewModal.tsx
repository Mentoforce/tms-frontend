"use client";

import api from "@/lib/axios";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Row } from "./util/Row";
import FileCard from "../FileCard";

export default function TicketViewModal({
  ticket,
  onClose,
  onUpdated,
}: {
  ticket: any;
  onClose: () => void;
  onUpdated: (ticket: any) => void;
}) {
  const [ticketData, setTicketData] = useState<any>({});
  const [ticketStatus, setTicketStatus] = useState<string>("");
  const [remarks, setRemarks] = useState<string>("");
  const [pendingUpdate, setPendingUpdate] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(5);

  // Prevent duplicate API calls (React 18 StrictMode safe)
  const hasUpdatedRef = useRef(false);

  const startUpdateTimer = () => {
    hasUpdatedRef.current = false;
    setSecondsLeft(5);
    setPendingUpdate(true);
  };

  const cancelUpdate = () => {
    setPendingUpdate(false);
    setSecondsLeft(5);
    hasUpdatedRef.current = false;
  };

  const updateStatus = async () => {
    if (hasUpdatedRef.current) return;
    hasUpdatedRef.current = true;
    await api.post("/tickets/update-ticket", {
      ticket_id: ticket._id,
      status: ticketStatus,
      comments: remarks,
    });
    onUpdated({
      ...ticket,
      status: ticketStatus,
      updatedAt: new Date().toISOString(),
    });
  };

  useEffect(() => {
    if (!pendingUpdate) return;

    if (secondsLeft === 0) {
      updateStatus();
      setPendingUpdate(false);
      return;
    }

    const timer = setTimeout(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [pendingUpdate, secondsLeft]);

  useEffect(() => {
    async function getTicket() {
      const res = await api.post("/tickets/search", {
        ticket_number: ticket.ticket_number,
        username: ticket.username,
      });
      setTicketData(res.data.data);
      setTicketStatus(res.data.data.ticket.status);
    }
    getTicket();
  }, []);

  if (!ticket) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-2xl rounded-xl bg-[#0B0F1A] border border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-lg font-semibold">
            Ticket {ticket.ticket_number}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X />
          </button>
        </div>
        {/* Content */}
        <div className="p-6 space-y-4 text-sm max-h-100 overflow-y-auto">
          <Row label="User" value={ticket.username} />
          <Row label="Status" value={ticket.status} />
          <Row label="Channel" value={ticket.channel} />
          <Row label="Subject" value={ticket.subject_id?.title} />
          <Row label="Sub Subject" value={ticket.sub_subject_id?.title} />

          <div>
            <p className="text-gray-400 mb-1">Description</p>
            <pre className="text-gray-200 bg-white/5 p-3 rounded-lg whitespace-pre-wrap">
              {ticket.description || "—"}
            </pre>
          </div>
          {ticketData.ticket?.audio_url && (
            <div>
              <p className="text-gray-400 mb-1">Audio</p>
              <audio
                controls
                src={ticketData.ticket.audio_url}
                className="w-full"
              />
            </div>
          )}
          {ticketData.ticket?.files?.length > 0 && (
            <div>
              <p className="text-gray-400 mb-3">Files</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {ticketData.ticket.files.map((file: any) => (
                  <FileCard key={file._id} file={file} />
                ))}
              </div>
            </div>
          )}

          {ticketData.history?.length > 0 && (
            <div>
              <p className="text-gray-400 mb-2">Ticket History</p>
              <div className="space-y-3">
                {ticketData.history.map((history: any) => (
                  <div
                    key={history._id}
                    className="text-xs bg-[#0B0F1A] p-4 rounded-lg border border-white/10"
                  >
                    <p>
                      <strong>Action By:</strong>{" "}
                      {history.admin_id
                        ? `Admin (${history.admin_id.email})`
                        : "User"}
                    </p>
                    <p>
                      <strong>Action:</strong> {history.action}
                    </p>
                    {history.comments && (
                      <p>
                        <strong>Comments:</strong> {history.comments}
                      </p>
                    )}
                    <p className="text-gray-400">
                      {new Date(history.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Footer */}
        <div className="flex flex-col gap-4 p-5 border-t border-white/10">
          <label>Status Update:</label>
          <select
            value={ticketStatus}
            onChange={(e) => setTicketStatus(e.target.value)}
            className="w-full rounded-lg px-4 py-3 text-sm bg-slate-950 text-white"
            style={{ border: "1px solid rgba(255,255,255,0.4)" }}
          >
            <option value="">Select</option>
            <option value="pending">Pending</option>
            <option value="updated">Updated</option>
            <option value="files_missing">Files missing</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>
          <textarea
            className="w-full p-4 border bg-black rounded-lg"
            rows={4}
            placeholder="Enter remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
          {!pendingUpdate ? (
            <button
              className="btn"
              onClick={startUpdateTimer}
              disabled={!ticketStatus}
            >
              Update Status
            </button>
          ) : (
            <button className="btn-danger" onClick={cancelUpdate}>
              Cancel ({secondsLeft}s)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
