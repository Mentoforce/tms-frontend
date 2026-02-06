"use client";

import { useState } from "react";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { X } from "lucide-react";

export default function InstallBanner() {
  const { canInstall, install } = useInstallPrompt();
  const [dismissed, setDismissed] = useState(false);

  if (!canInstall || dismissed) return null;

  return (
    <div
      className="
        fixed top-4 left-1/2 -translate-x-1/2
        max-w-xl w-[calc(100%-2rem)]
        z-250 rounded-2xl
        bg-linear-to-br from-neutral-900 via-black to-neutral-800
        text-white
        border border-white/15
        p-4
        shadow-[0_10px_25px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.08)]
        backdrop-blur-md
      "
    >
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-white/90">
          Install this app on your device
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={install}
            className="
              px-4 py-2 rounded-lg
              bg-white text-black
              text-sm font-semibold
              shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_rgba(0,0,0,0.25)]
              hover:shadow-[0_2px_0_rgba(255,255,255,0.7),0_6px_18px_rgba(0,0,0,0.35)]
              transition
            "
          >
            Install
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="
              p-2 rounded-lg
              text-white/60 hover:text-white
              hover:bg-white/10
              transition
            "
            aria-label="Dismiss install banner"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
