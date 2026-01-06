"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios"; // your axios utility

interface BonusConfig {
  _id: string;
  title: string;
  explanation: string;
  is_active: boolean;
}

export default function BonusClaimModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [bonusConfigs, setBonusConfigs] = useState<BonusConfig[]>([]);
  const [selectedBonus, setSelectedBonus] = useState<BonusConfig | null>(null);
  const [successModal, setSuccessModal] = useState<boolean>(false);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBonusConfigs();
  }, []);

  useEffect(() => {
    if (open) {
      setSelectedBonus(null);
      setUsername("");
      setSuccessModal(false);
      setLoading(false);
    }
  }, [open]);

  const fetchBonusConfigs = async () => {
    try {
      const res = await axios.get("/subjects/bonus-config");
      setBonusConfigs(res.data.data);
    } catch (error) {
      console.error("Failed to fetch bonus configs", error);
    }
  };

  const handleSubmit = async () => {
    if (!username || !selectedBonus) return;

    try {
      setLoading(true);

      await axios.post("/tickets/create/bonus", {
        username,
        bonus_type_id: selectedBonus._id,
      });
      setSuccessModal(true);
    } catch (error) {
      console.error("Bonus claim failed", error);
    } finally {
      setLoading(false);
    }
  };
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-blue-950 w-full max-w-3xl rounded-lg shadow-lg p-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Request Callback</h2>
          <button onClick={onClose}>✕</button>
        </div>
        {successModal ? (
          <SuccessScreen onClose={onClose} />
        ) : (
          <>
            {/* Bonus Select */}
            <select
              className="w-full border rounded px-3 py-2"
              value={selectedBonus?._id || ""}
              onChange={(e) => {
                const bonus = bonusConfigs.find(
                  (b) => b._id === e.target.value
                );
                setSelectedBonus(bonus || null);
              }}
            >
              <option value="">Select Bonus Type</option>
              {bonusConfigs.map((bonus) => (
                <option key={bonus._id} value={bonus._id}>
                  {bonus.title}
                </option>
              ))}
            </select>
            {/* Conditional Explanation */}
            {selectedBonus && (
              <div className="border rounded p-3 bg-gray-50 text-sm text-gray-700">
                {selectedBonus.explanation}
              </div>
            )}
            {/* Username Input */}
            <input
              type="text"
              placeholder="Enter username"
              className="w-full border rounded px-3 py-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {/* Actions */}
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 text-sm border rounded"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm bg-black text-white rounded disabled:opacity-50"
                disabled={!username || !selectedBonus || loading}
                onClick={handleSubmit}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function SuccessScreen({ onClose }: { onClose: () => void }) {
  return (
    <div className="text-center space-y-4">
      <h3 className="text-lg font-semibold">Bonus Claim Request </h3>
      <div className="flex justify-center gap-3">
        <button className="btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
