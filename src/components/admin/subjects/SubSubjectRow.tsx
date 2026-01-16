"use client";

import { Pen, Trash } from "lucide-react";
import { useState } from "react";
import SubSubjectModal from "./SubSubjectModal";
import api from "@/lib/axios";
import ActivePill from "@/components/ActivePill";

export default function SubSubjectRow({
  subSubject,
  subjectId,
  onRefresh,
}: {
  subSubject: any;
  subjectId: string;
  onRefresh: () => void;
}) {
  const [editOpen, setEditOpen] = useState(false);

  const toggleActive = async () => {
    await api.post("/subjects/add-subsubject", {
      subject_id: subjectId,
      sub_subject_id: subSubject._id,
      is_active: !subSubject.is_active,
    });
    onRefresh();
  };

  const remove = async () => {
    await api.post("/subjects/delete-subsubject", {
      sub_subject_id: subSubject._id,
    });
    onRefresh();
  };

  return (
    <>
      <div className="flex items-center justify-between rounded-lg border border-white/5 px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-white">
            {subSubject.title}
          </span>

          {subSubject.predefined_text && (
            <span className="text-xs px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 hidden md:block">
              Template Available
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Active pill */}
          <button onClick={toggleActive} className="cursor-pointer">
            <ActivePill status={subSubject.is_active} />
          </button>

          {/* Edit */}
          <button
            onClick={() => setEditOpen(true)}
            className="text-gray-400 hover:text-white cursor-pointer"
          >
            <Pen size={14} />
          </button>

          {/* Delete */}
          <button
            onClick={remove}
            className="text-gray-400 hover:text-red-400 cursor-pointer"
          >
            <Trash size={14} />
          </button>
        </div>
      </div>

      {editOpen && (
        <SubSubjectModal
          subjectId={subjectId}
          initialData={subSubject}
          onClose={() => setEditOpen(false)}
          onSaved={onRefresh}
        />
      )}
    </>
  );
}
