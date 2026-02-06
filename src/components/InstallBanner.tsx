"use client";

import { useEffect, useState } from "react";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { X } from "lucide-react";

export default function InstallBanner() {
  const { canInstall, install } = useInstallPrompt();

  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Mount when install is possible
  useEffect(() => {
    if (canInstall) {
      setMounted(true);
      requestAnimationFrame(() => setVisible(true));
    }
  }, [canInstall]);

  // Auto-dismiss after 10 seconds
  useEffect(() => {
    if (!visible) return;

    const timer = setTimeout(() => {
      setVisible(false);
    }, 10_000);

    return () => clearTimeout(timer);
  }, [visible]);

  // Remove from DOM after exit animation
  useEffect(() => {
    if (!visible && mounted) {
      const timeout = setTimeout(() => {
        setMounted(false);
      }, 300); // must match transition duration

      return () => clearTimeout(timeout);
    }
  }, [visible, mounted]);

  if (!mounted) return null;

  return (
    <div
      className={`
        fixed
        bottom-4 md:top-4 md:bottom-auto
        left-1/2 -translate-x-1/2
        max-w-xl w-[calc(100%-2rem)]
        z-250 rounded-2xl
        bg-linear-to-br from-neutral-900 via-black to-neutral-800
        text-white
        border border-white/15
        p-4
        backdrop-blur-md
        shadow-[0_10px_25px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.08)]
        transition-all duration-300 ease-out

        ${
          visible
            ? "opacity-100 translate-y-0 md:translate-y-0"
            : "opacity-0 translate-y-8 md:-translate-y-8"
        }
      `}
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
            onClick={() => setVisible(false)}
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
