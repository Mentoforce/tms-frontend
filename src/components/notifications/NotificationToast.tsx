"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { PublicNotification } from "./NotificationTypes";

export default function NotificationToast({
  data,
  primarycolor = "#DFD1A1",
}: {
  data: PublicNotification;
  primarycolor?: string;
}) {
  const [open, setOpen] = useState(true);
  if (!open) return null;

  return (
    <div
      className="rounded-xl border p-4 bg-black text-white shadow-xl"
      style={{ borderColor: `${primarycolor}66` }}
    >
      <div className="flex justify-between items-start gap-3">
        <div>
          <h4
            className="font-semibold text-sm mb-1"
            style={{ color: primarycolor }}
          >
            {data.title}
          </h4>
          <p className="text-xs text-gray-300 leading-relaxed">
            {data.message}
          </p>

          {data.link && (
            <a
              href={data.link}
              className="inline-block mt-2 text-xs underline"
              style={{ color: primarycolor }}
            >
              Close
            </a>
          )}
        </div>

        <X
          className="w-4 h-4 cursor-pointer text-gray-400 hover:text-white"
          onClick={() => setOpen(false)}
        />
      </div>
    </div>
  );
}
