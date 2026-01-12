import { Plus } from "lucide-react";
import SubjectCard from "./SubjectCard";
import SubjectModal from "./SubjectModal";
import { useState } from "react";

export default function SubjectList({ subjects, stats, onRefresh }: any) {
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="space-y-6">
      {openModal && (
        <SubjectModal onClose={() => setOpenModal(false)} onSaved={onRefresh} />
      )}
      {/* Header */}
      <div className="flex justify-between">
        <div>
          <h1 className="text-xl font-semibold">Support Topic Management</h1>
          <p className="text-gray-400 text-sm">
            Manage support system topics and subtopics.
          </p>
        </div>

        <button className="btn" onClick={() => setOpenModal(true)}>
          <div className="flex items-center">
            <Plus size={16} /> Add Main Topic
          </div>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Stat label="Main Topics" value={stats.main} />
        <Stat label="Subtopics" value={stats.sub} />
        <Stat label="Active Topics" value={stats.active} />
      </div>

      <div className="space-y-4">
        {subjects.map((s: any) => (
          <SubjectCard key={s._id} subject={s} onRefresh={onRefresh} />
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value }: any) {
  return (
    <div className="rounded-xl border border-white/10 p-4">
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  );
}
