"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { NotificationItem } from "@/types/notification";

type FormState = Partial<NotificationItem> & {
  start_date?: string;
  end_date?: string;
};

const toInputDate = (date?: string | Date) =>
  date ? new Date(date).toISOString().slice(0, 10) : "";

export default function NotificationModal({
  initialData,
  onClose,
  onSaved,
}: {
  initialData: Partial<NotificationItem>;
  onClose: () => void;
  onSaved: (saved: NotificationItem) => void;
}) {
  const [form, setForm] = useState<FormState>({
    ...initialData,
    start_date: toInputDate(initialData.start_date),
    end_date: toInputDate(initialData.end_date),
  });

  const [loading, setLoading] = useState(false);

  const save = async () => {
    try {
      setLoading(true);

      const payload = {
        ...form,
        end_date: form.end_date || null, // Infinity support
      };

      const res = await api.post("/notifications", payload);
      onSaved(res.data);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to save notification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6 w-full max-w-md space-y-4">
        <input
          className="input w-full"
          placeholder="Title"
          value={form.title || ""}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <textarea
          className="input w-full"
          placeholder="Message"
          rows={4}
          value={form.message || ""}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />

        <select
          className="input w-full"
          value={form.type || "info"}
          onChange={(e) =>
            setForm({
              ...form,
              type: e.target.value as NotificationItem["type"],
            })
          }
        >
          <option value="info">Info</option>
          <option value="success">Success</option>
          <option value="warning">Warning</option>
          <option value="error">Error</option>
        </select>

        <input
          type="date"
          className="input w-full"
          value={form.start_date}
          onChange={(e) => setForm({ ...form, start_date: e.target.value })}
        />

        <input
          type="date"
          className="input w-full"
          value={form.end_date}
          onChange={(e) => setForm({ ...form, end_date: e.target.value })}
        />

        <p className="text-xs text-white/50">
          Leave end date empty for infinity
        </p>

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="p-2 border border-white/20 rounded-sm cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={save}
            disabled={loading}
            className="btn cursor-pointer disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
