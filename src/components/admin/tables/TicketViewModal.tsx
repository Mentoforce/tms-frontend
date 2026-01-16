"use client";

import api from "@/lib/axios";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
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

  const startUpdateTimer = () => {
    setPendingUpdate(true);
    setSecondsLeft(5);
  };

  const cancelUpdate = () => {
    setPendingUpdate(false);
    setSecondsLeft(5);
  };

  const updateStatus = async () => {
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

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          updateStatus();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [pendingUpdate]);

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
  console.log(ticketData.ticket);
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
              <pre className="text-gray-200 bg-white/5 p-3 rounded-lg whitespace-pre-wrap">
                <audio
                  controls
                  src={ticketData.ticket.audio_url}
                  className="w-full"
                />
              </pre>
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

          {ticketData.history && (
            <div>
              <p className="text-gray-400 mb-1">Ticket History</p>
              <pre className="text-gray-200 bg-white/5 p-3 rounded-lg whitespace-pre-wrap">
                {ticketData.history.map((history: any) => {
                  return (
                    <div
                      key={history._id}
                      className="text-xs space-y-1 bg-[#0B0F1A] p-4"
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
                      <p>
                        <strong>Date:</strong>{" "}
                        {new Date(history.createdAt).toLocaleString()}
                      </p>
                    </div>
                  );
                })}
              </pre>
            </div>
          )}
        </div>
        <div className=" flex flex-col gap-4 p-5">
          <label>Status Update:</label>
          <select
            value={ticketStatus}
            onChange={(e) => setTicketStatus(e.target.value)}
            className="select-clean w-full rounded-lg px-4 py-4 pr-12 text-sm bg-transparent text-white disabled:opacity-50 focus:outline-none"
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
            className="w-full p-5 border bg-black"
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
