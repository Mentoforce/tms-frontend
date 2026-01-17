"use client";

import { X } from "lucide-react";
import { useState } from "react";
import api from "@/lib/axios";

export default function SubjectModal({ initialData, onClose, onSaved }: any) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true);

  const submit = async () => {
    await api.post("/subjects/add-subject", {
      subject_id: initialData?._id,
      title,
      is_active: isActive,
    });
    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-lg rounded-xl bg-[#0B0F1A] border border-white/10 p-6">
        <div className="flex justify-between">
          <h2>{initialData ? "Update" : "Create"} Subject</h2>
          <X onClick={onClose} />
        </div>

        <input
          className="input"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label className="flex gap-2">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          Active
        </label>

        <button className="btn" onClick={submit}>
          Save
        </button>
      </div>
    </div>
  );
}
