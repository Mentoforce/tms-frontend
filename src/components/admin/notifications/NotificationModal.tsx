// "use client";

// import { useState } from "react";
// import api from "@/lib/axios";
// import { NOTIFICATION_TYPES } from "./NotificationTypes";

// export default function NotificationModal({
//   initialData,
//   onClose,
//   onSaved,
// }: any) {
//   const [form, setForm] = useState({
//     ...initialData,
//     title: initialData.title || "",
//     message: initialData.message || "",
//     detail: initialData.detail || "",
//     end_date: initialData.end_date || "",
//   });

//   const save = async () => {
//     const res = await api.post("/admin/notifications", form);
//     onSaved(res.data);
//     onClose();
//   };

//   return (
//     <div className="modal max-w-2xl">
//       <h2 className="text-lg font-semibold mb-6">Add New Notification</h2>

//       <div className="grid grid-cols-2 gap-4 mb-4">
//         <select
//           className="input"
//           value={form.type}
//           onChange={(e) => setForm({ ...form, type: e.target.value })}
//         >
//           {NOTIFICATION_TYPES.map((t) => (
//             <option key={t.value} value={t.value}>
//               {t.label}
//             </option>
//           ))}
//         </select>

//         <input
//           className="input"
//           type="number"
//           value={form.serial}
//           onChange={(e) => setForm({ ...form, serial: +e.target.value })}
//           placeholder="Serial number"
//         />
//       </div>

//       <input
//         className="input mb-3"
//         placeholder="Title"
//         value={form.title}
//         onChange={(e) => setForm({ ...form, title: e.target.value })}
//       />

//       <input
//         className="input mb-3"
//         placeholder="Short message"
//         value={form.message}
//         onChange={(e) => setForm({ ...form, message: e.target.value })}
//       />

//       <textarea
//         className="input mb-3"
//         rows={4}
//         placeholder="Detail"
//         value={form.detail}
//         onChange={(e) => setForm({ ...form, detail: e.target.value })}
//       />

//       <input
//         type="datetime-local"
//         className="input mb-3"
//         value={form.end_date || ""}
//         onChange={(e) => setForm({ ...form, end_date: e.target.value })}
//       />

//       <label className="flex gap-2 mb-4">
//         <input
//           type="checkbox"
//           checked={form.is_active}
//           onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
//         />
//         Notification active
//       </label>

//       <div className="flex justify-end gap-2">
//         <button onClick={onClose} className="btn-secondary">
//           Cancel
//         </button>
//         <button onClick={save} className="btn-primary">
//           Save
//         </button>
//       </div>
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { NotificationItem } from "@/types/notification";

export default function NotificationModal({
  initialData,
  onClose,
  onSaved,
}: {
  initialData: Partial<NotificationItem>;
  onClose: () => void;
  onSaved: (saved: NotificationItem) => void;
}) {
  const [form, setForm] = useState(initialData);

  const save = async () => {
    const res = await api.post("/admin/notifications", form);
    onSaved(res.data);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
      <div className="bg-[#0A0A0A] rounded-xl p-6 w-full max-w-md space-y-4">
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
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value as any })}
        >
          <option value="info">Info</option>
          <option value="success">Success</option>
          <option value="warning">Warning</option>
          <option value="error">Error</option>
        </select>

        <input
          type="date"
          className="input w-full"
          onChange={(e) => setForm({ ...form, start_date: e.target.value })}
        />

        <input
          type="date"
          className="input w-full"
          onChange={(e) => setForm({ ...form, end_date: e.target.value })}
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button onClick={save} className="btn-primary">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
