"use client";

import api from "@/lib/axios";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Row } from "./util/Row";

export default function BonusViewModal({
  bonus,
  onClose,
  onUpdated,
}: {
  bonus: any;
  onClose: () => void;
  onUpdated: (ticket: any) => void;
}) {
  const [bonusStatus, setBonusStatus] = useState<string>(bonus.status);
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
    await api.post("/tickets/update-bonus", {
      bonus_id: bonus._id,
      status: bonusStatus,
      remarks: remarks,
    });
    onUpdated({
      ...bonus,
      status: bonusStatus,
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

  if (!bonus) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-2xl rounded-xl bg-[#0B0F1A] border border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-lg font-semibold">Edit Bonus Claim Request </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-sm max-h-110 overflow-y-auto">
          <Row label="User" value={bonus.username} />
          <Row label="Bonus Type" value={bonus.bonus_type_id.title} />
          <Row label="Status" value={bonus.status} />
          <Row label="Latest Admin Remarks" value={bonus.remarks} />
        </div>
        <div className=" flex flex-col gap-4 p-5">
          <label>Status Update</label>
          <select
            value={bonusStatus}
            onChange={(e) => setBonusStatus(e.target.value)}
            className="select-clean w-full rounded-lg px-4 py-4 pr-12 text-sm bg-transparent text-white disabled:opacity-50 focus:outline-none"
            style={{ border: "1px solid rgba(255,255,255,0.4)" }}
          >
            <option value="">Select</option>
            <option value="pending">Pending</option>
            <option value="review">Under Review</option>
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
              disabled={!bonusStatus}
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
