"use client";

import { X } from "lucide-react";
import { useState } from "react";
import api from "@/lib/axios";

export default function SubSubjectModal({
  subjectId,
  initialData,
  onClose,
  onSaved,
}: {
  subjectId: string;
  initialData?: any;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [information, setInformation] = useState(
    initialData?.information || ""
  );
  const [template, setTemplate] = useState(initialData?.predefined_text || "");
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true);

  const submit = async () => {
    await api.post("/subjects/add-subsubject", {
      subject_id: subjectId,
      sub_subject_id: initialData?._id,
      title,
      information,
      predefined_text: template,
      is_active: isActive,
    });

    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-lg rounded-xl bg-[#0B0F1A] border border-white/10 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            {initialData ? "Update" : "Create"} Subtopic
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X />
          </button>
        </div>

        {/* Title */}
        <input
          className="w-full mb-3 px-4 py-3 rounded bg-black border border-white/10 text-sm"
          placeholder="Subtopic title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Information */}
        <textarea
          rows={3}
          className="w-full mb-3 px-4 py-3 rounded bg-black border border-white/10 text-sm"
          placeholder="Information shown to user"
          value={information}
          onChange={(e) => setInformation(e.target.value)}
        />

        {/* Template */}
        <textarea
          rows={4}
          className="w-full mb-3 px-4 py-3 rounded bg-black border border-white/10 text-sm"
          placeholder="Predefined response template"
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
        />

        {/* Active */}
        <label className="flex items-center gap-2 mb-5 text-sm">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          Active
        </label>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border border-white/10 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            className="px-4 py-2 rounded bg-indigo-600 text-sm"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
