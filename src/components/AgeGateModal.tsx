"use client";

import { useState } from "react";

type AgeGateModalProps = {
  onVerified: () => void;
};

export default function AgeGateModal({ onVerified }: AgeGateModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = () => {
    if (submitting) return;

    setSubmitting(true);
    setError("");

    try {
      // Persist verification (can be moved to cookie later)
      localStorage.setItem("age_verified", "true");

      // Inform parent to redirect
      onVerified();
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  const handleReject = () => {
    if (document.referrer) {
      window.location.href = document.referrer;
    } else {
      window.location.href = "https://www.google.com";
    }
  };

  return (
    <div
      className="fixed inset-0 z-1000 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
    >
      <div className="w-full max-w-lg max-h-xl rounded-2xl bg-[#0B0F1A] border border-white/10 p-6 text-white shadow-xl">
        <h2 className="text-2xl font-semibold mb-4 text-center text-red-500">
          ATTENTION TO OUR USERS
        </h2>
        <p className="text-sm text-gray-300 leading-relaxed mb-6 text-center py-10">
          It is strictly forbidden for those under the age of 18 to use this
          platform !!!
          <br />
          <br />
          If false information is provided during age verification , all
          requests will be considered invalid and services will not be provided.
          We take utmost care to ensure our users have a safe and enjoyable
          experience with the system; our focus is never on financial gain, but
          on providing a healthy and sustainable experience.
          <br />
          <br />
          If you feel you lack sufficient awareness of play and risks , or if
          you are having difficulty controlling your own behavior , we strongly
          recommend that you seek professional help from the nearest healthcare
          facility .
        </p>
        {error && (
          <div className="mt-4 rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-2 text-sm text-red-400 ">
            {error}
          </div>
        )}
        <div className="mt-6 flex gap-3">
          <button
            onClick={handleReject}
            disabled={submitting}
            className="w-full rounded-lg border border-white/20 py-3 text-sm hover:bg-white/5 cursor-pointer"
          >
            I am under 18
          </button>
          <button
            onClick={handleConfirm}
            disabled={submitting}
            className="w-full rounded-lg bg-green-600 py-3 text-sm font-semibold hover:bg-green-500 disabled:opacity-60 cursor-pointer"
          >
            {submitting ? "Verifying..." : "I am 18 or older"}
          </button>
        </div>
      </div>
    </div>
  );
}
