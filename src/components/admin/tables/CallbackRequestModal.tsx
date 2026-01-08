"use client";

import api from "@/lib/axios";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Row } from "./util/Row";

export default function CallbackViewModal({
  callback,
  onClose,
  onUpdated,
}: {
  callback: any;
  onClose: () => void;
  onUpdated: (ticket: any) => void;
}) {
  const [callbackStatus, setCallbackStatus] = useState<string>(callback.status);
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
    await api.post("/tickets/update-callback-request", {
      request_id: callback._id,
      status: callbackStatus,
      remarks: remarks,
    });
    onUpdated({
      ...callback,
      status: callbackStatus,
      remarks: remarks,
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

  if (!callback) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-2xl rounded-xl bg-[#0B0F1A] border border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-lg font-semibold">Edit Callback Request </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-sm max-h-110 overflow-y-auto">
          {callback.username && <Row label="User" value={callback.username} />}
          {callback.phone && <Row label="Phone" value={callback.phone} />}
          <Row label="Status" value={callback.status} />
          <Row label="Latest Admin Remarks" value={callback.remarks} />

          <div>
            <p className="text-gray-400 mb-1">Description</p>
            <pre className="text-gray-200 bg-white/5 p-3 rounded-lg">
              {callback.issue || "—"}
            </pre>
          </div>
          {callback.audio_url && (
            <div>
              <p className="text-gray-400 mb-1">Audio</p>
              <pre className="text-gray-200 bg-white/5 p-3 rounded-lg">
                <audio>
                  <source src={callback.audio_url} type="audio/mpeg" />
                </audio>
                {/* <a href={ticketData.ticket.audio_url} target="_blank">
                  AUDIO
                </a> */}
              </pre>
            </div>
          )}
        </div>
        <div className=" flex flex-col gap-4 p-5">
          <select
            value={callbackStatus}
            onChange={(e) => setCallbackStatus(e.target.value)}
            className="select-clean w-full rounded-lg px-4 py-4 pr-12 text-sm bg-transparent text-white disabled:opacity-50 focus:outline-none"
            style={{ border: "1px solid rgba(255,255,255,0.4)" }}
          >
            <option value="">Select</option>
            <option value="pending">Pending</option>
            <option value="waiting">Waiting</option>
            <option value="missed">Missed Call</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>
          <textarea
            className="w-full p-5 border bg-black"
            rows={4}
            placeholder="Enter remarks (optional)"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
          {!pendingUpdate ? (
            <button
              className="btn"
              onClick={startUpdateTimer}
              disabled={!callbackStatus}
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
