"use client";

import { ChevronDown, Pen, Trash, Plus } from "lucide-react";
import { useState } from "react";
import SubSubjectRow from "./SubSubjectRow";
import SubjectModal from "./SubjectModal";
import SubSubjectModal from "./SubSubjectModal";
import api from "@/lib/axios";
import ActivePill from "@/components/ActivePill";

export default function SubjectCard({ subject, onRefresh }: any) {
  const [open, setOpen] = useState(true);
  const [editModal, setEditModal] = useState(false);
  const [subModal, setSubModal] = useState(false);
  const toggleActive = async () => {
    await api.post("/subjects/add-subject", {
      subject_id: subject._id,
      is_active: !subject.is_active,
    });
    onRefresh();
  };

  return (
    <div className="rounded-xl border border-white/10 p-4">
      {/* Subject Header */}
      <div className="flex justify-between items-center">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          <ChevronDown className={`transition ${open ? "" : "-rotate-90"}`} />
          <h3 className="font-medium">{subject.title}</h3>
          <span className="text-xs text-gray-400">
            {subject.sub_subjects.length} subtopics
          </span>
        </div>

        <div className="flex gap-2">
          <button onClick={toggleActive} className="cursor-pointer">
            <ActivePill status={subject.is_active} />
          </button>
          <button onClick={() => setEditModal(true)} className="cursor-pointer">
            <Pen size={14} />
          </button>
          <button
            onClick={async () => {
              await api.post("/subjects/delete-subject", {
                subject_id: subject._id,
              });
              onRefresh();
            }}
            className="hover:text-red-400 cursor-pointer"
          >
            <Trash size={14} />
          </button>
        </div>
      </div>

      {/* Sub-subjects */}
      {open && (
        <div className="mt-4 space-y-3">
          {subject.sub_subjects.map((ss: any) => (
            <SubSubjectRow
              key={ss._id}
              subSubject={ss}
              subjectId={subject._id}
              onRefresh={onRefresh}
            />
          ))}
          <button
            className="text-sm text-gray-400 hover:text-white border border-dashed p-4 w-full rounded-lg"
            onClick={() => setSubModal(true)}
          >
            <div className="flex items-center justify-center gap-4">
              <Plus size={14} /> Add a subtopic
            </div>
          </button>
        </div>
      )}

      {editModal && (
        <SubjectModal
          initialData={subject}
          onClose={() => setEditModal(false)}
          onSaved={onRefresh}
        />
      )}

      {subModal && (
        <SubSubjectModal
          subjectId={subject._id}
          onClose={() => setSubModal(false)}
          onSaved={onRefresh}
        />
      )}
    </div>
  );
}
