"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { motion } from "framer-motion";

interface BonusConfig {
  _id: string;
  title: string;
  explanation: string;
  is_active: boolean;
}

const DEFAULT_PRIMARY = "#DFD1A1";

export default function BonusClaimModal({
  open,
  onClose,
  primarycolor,
}: {
  open: boolean;
  onClose: () => void;
  primarycolor: string;
}) {
  const accent = primarycolor || DEFAULT_PRIMARY;

  const [bonusConfigs, setBonusConfigs] = useState<BonusConfig[]>([]);
  const [selectedBonus, setSelectedBonus] = useState<BonusConfig | null>(null);
  const [successModal, setSuccessModal] = useState<boolean>(false);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const usernameRegex = /^[a-zA-Z0-9]{4,}$/;
  const isUsernameValid = usernameRegex.test(username);

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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4"
      style={{ ["--accent" as any]: accent, color: accent }}
    >
      <div
        className="w-full max-w-125 rounded-2xl bg-[#0A0A0A]"
        style={{ border: "1px solid var(--accent)" }}
      >
        <div className="px-6 sm:px-10 pt-7 pb-2">
          <div className="flex items-center justify-between">
            <h2 className="font-medium text-2xl pt-2">Claim Bonus</h2>
            <button
              onClick={onClose}
              className=" hover:opacity-80 text-2xl cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div
            className="mt-4 opacity-40"
            style={{ borderBottom: "1px solid" }}
          />
        </div>

        <div className="px-10 pt-5 pb-12 space-y-4">
          {successModal ? (
            <SuccessScreen onClose={onClose} />
          ) : (
            <>
              <h3 className="text-md font-base mb-3">Bonus Details</h3>

              <div>
                <label className="block text-sm mb-2">Bonus Type</label>

                <div className="relative">
                  <select
                    value={selectedBonus?._id || ""}
                    onChange={(e) => {
                      const bonus = bonusConfigs.find(
                        (b) => b._id === e.target.value,
                      );
                      setSelectedBonus(bonus || null);
                    }}
                    className="select-clean mb-1 w-full rounded-lg px-4 py-4 pr-12 text-sm bg-transparent focus:outline-none cursor-pointer"
                    style={{ border: "1px solid" }}
                  >
                    <option value="" style={{ color: accent }}>
                      Choose a bonus type
                    </option>
                    {bonusConfigs.map((bonus) => (
                      <option
                        key={bonus._id}
                        value={bonus._id}
                        style={{ color: accent }}
                      >
                        {bonus.title}
                      </option>
                    ))}
                  </select>

                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                    ▾
                  </span>
                </div>

                {selectedBonus && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="overflow-hidden rounded-lg"
                    style={{
                      border: "1px solid rgba(255,255,255,0.25)",
                      background: "rgba(255,255,255,0.06)",
                    }}
                  >
                    <div className="px-4 py-3 text-sm leading-relaxed opacity-80">
                      {selectedBonus.explanation}
                    </div>
                  </motion.div>
                )}
              </div>

              <div>
                <label className="block text-sm mb-2">Your Username</label>

                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full mb-1 rounded-lg px-4 py-4 text-sm bg-transparent focus:outline-none placeholder:text-base"
                  style={{
                    border: `1px solid "var(--accent)"
                    }`,
                  }}
                />
                {username && !isUsernameValid && (
                  <p className="text-xs text-red-400 mt-1">
                    Username must be at least 4 characters and contain no
                    special symbols
                  </p>
                )}
              </div>

              <button
                onClick={handleSubmit}
                disabled={
                  !username || !isUsernameValid || !selectedBonus || loading
                }
                className="cursor-pointer w-full mt-4 py-3 rounded-lg text-base font-bold text-black transition disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ backgroundColor: "var(--accent)" }}
              >
                {loading ? "Submitting..." : "Submit →"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function SuccessScreen({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="flex flex-col items-center space-y-4"
      style={{ color: "var(--accent)" }}
    >
      <motion.svg
        width="66"
        height="66"
        viewBox="0 0 52 52"
        initial="hidden"
        animate="visible"
      >
        <motion.circle
          cx="26"
          cy="26"
          r="24"
          fill="#22c55e"
          variants={{
            hidden: { scale: 0 },
            visible: {
              scale: 1,
              transition: { duration: 0.45, ease: "easeOut" },
            },
          }}
        />
        <motion.path
          d="M14 27 L22 35 L38 19"
          fill="none"
          stroke="#000"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            visible: {
              pathLength: 1,
              opacity: 1,
              transition: {
                delay: 0.45,
                duration: 0.35,
                ease: "easeOut",
              },
            },
          }}
        />
      </motion.svg>

      <p className="w-full text-base opacity-70 text-left">
        Your bonus claim request has been submitted successfully.
      </p>

      <button
        onClick={onClose}
        className="w-full py-3 rounded-lg text-sm font-bold text-black cursor-pointer"
        style={{ backgroundColor: "var(--accent)" }}
      >
        Close
      </button>
    </div>
  );
}
