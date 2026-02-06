"use client";

import { useInstallPrompt } from "@/hooks/useInstallPrompt";

export default function InstallBanner() {
  const { canInstall, install } = useInstallPrompt();

  if (!canInstall) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 rounded-xl bg-black text-white p-4 shadow-lg">
      <div className="flex items-center justify-between">
        <p className="text-sm">Install this app on your phone</p>
        <button
          onClick={install}
          className="px-4 py-2 bg-white text-black rounded-lg text-sm"
        >
          Install
        </button>
      </div>
    </div>
  );
}
