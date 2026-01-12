"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/lib/axios";

export default function CreateBonusConfigModal({
  initialData,
  onClose,
  onSaved,
}: {
  initialData?: any;
  onClose: () => void;
  onSaved: (config: any) => void;
}) {
  const [form, setForm] = useState({
    _id: "",
    title: "",
    explanation: "",
    start_date: "",
    end_date: "",
    is_active: true,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        _id: initialData._id || "",
        title: initialData.title || "",
        explanation: initialData.explanation || "",
        start_date: initialData.start_date || "",
        end_date: initialData.end_date || "",
        is_active: initialData.is_active ?? true,
      });
    }
  }, [initialData]);

  const submit = async () => {
    setLoading(true);
    try {
      const payload = {
        ...form,
        bonus_type_id: form._id || undefined,
      };

      const res = await api.post("/subjects/add-bonus-config", payload);
      onSaved(res.data.data);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-lg rounded-xl bg-[#0B0F1A] border border-white/10">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-white/10">
          <h2 className="text-lg font-semibold">
            {form._id ? "Update Bonus Config" : "Create Bonus Config"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-sm">
          <input
            className="input w-full"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <textarea
            className="input w-full"
            placeholder="Explanation"
            rows={5}
            value={form.explanation}
            onChange={(e) => setForm({ ...form, explanation: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-4">
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
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) =>
                setForm({ ...form, is_active: e.target.checked })
              }
            />
            Active
          </label>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10">
          <button onClick={submit} disabled={loading} className="btn w-full">
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
