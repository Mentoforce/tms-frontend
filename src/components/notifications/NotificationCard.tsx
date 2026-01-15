"use client";

import {
  IconInfoCircle,
  IconAlertTriangle,
  IconCheck,
} from "@tabler/icons-react";
import { NotificationItem } from "@/types/notification";

const icons: any = {
  info: IconInfoCircle,
  success: IconCheck,
  warning: IconAlertTriangle,
  error: IconAlertTriangle,
};

export default function NotificationCard({
  notification,
  onClose,
  accent,
}: {
  notification: NotificationItem;
  onClose: () => void;
  accent: string;
}) {
  const Icon = icons[notification.type];

  return (
    <div
      className="fixed top-6 right-6 max-w-sm rounded-xl p-4 shadow-lg bg-black text-white z-50"
      style={{ borderColor: accent, borderWidth: 1 }}
    >
      <div className="flex gap-3">
        <Icon />
        <div>
          <p className="font-semibold">{notification.title}</p>
          <p className="text-sm text-white/70">{notification.message}</p>
        </div>
      </div>

      <button
        onClick={onClose}
        className="text-xs mt-3 underline text-white/60"
      >
        Don’t show again
      </button>
    </div>
  );
}
