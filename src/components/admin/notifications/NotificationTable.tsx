// "use client";

// import { Pen, Trash } from "lucide-react";
// import { useState } from "react";
// import api from "@/lib/axios";
// import NotificationModal from "./NotificationModal";
// import { NotificationItem } from "./NotificationTypes";

// export default function NotificationTable({ data }: { data: any[] }) {
//   const [items, setItems] = useState(data);
//   const [editing, setEditing] = useState<any | null>(null);

//   return (
//     <>
//       <button
//         className="btn mb-6"
//         onClick={() =>
//           setEditing({
//             type: "information",
//             serial: items.length + 1,
//             is_active: true,
//           })
//         }
//       >
//         + Add New Notification
//       </button>

//       {editing && (
//         <NotificationModal
//           initialData={editing}
//           onClose={() => setEditing(null)}
//           onSaved={(saved: NotificationItem) => {
//             setItems((prev) => {
//               const exists = prev.find((i) => i._id === saved._id);
//               return exists
//                 ? prev.map((i) => (i._id === saved._id ? saved : i))
//                 : [...prev, saved];
//             });
//           }}
//         />
//       )}

//       <div className="rounded-xl border border-white/10">
//         <table className="w-full text-sm">
//           <thead className="bg-white/5">
//             <tr>
//               <th>Type</th>
//               <th>Title</th>
//               <th>Message</th>
//               <th>Status</th>
//               <th>Validity</th>
//               <th></th>
//             </tr>
//           </thead>

//           <tbody>
//             {items.map((n) => (
//               <tr key={n._id} className="border-t border-white/5">
//                 <td>{n.type}</td>
//                 <td>{n.title}</td>
//                 <td className="truncate max-w-sm">{n.message}</td>
//                 <td>{n.is_active ? "Active" : "Inactive"}</td>
//                 <td>
//                   {n.end_date
//                     ? new Date(n.end_date).toLocaleString()
//                     : "Indefinite"}
//                 </td>
//                 <td className="flex gap-2">
//                   <Pen onClick={() => setEditing(n)} />
//                   <Trash
//                     onClick={async () => {
//                       await api.post("/admin/notifications/delete", {
//                         notification_id: n._id,
//                       });
//                       setItems(items.filter((i) => i._id !== n._id));
//                     }}
//                   />
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </>
//   );
// }

"use client";

import { useState } from "react";
import { Pen, Trash } from "lucide-react";
import api from "@/lib/axios";
import ActivePill from "@/components/ActivePill";
import NotificationModal from "./NotificationModal";
import { NotificationItem } from "@/types/notification";

export default function NotificationTable({
  data,
}: {
  data: NotificationItem[];
}) {
  const [items, setItems] = useState(data);
  const [editing, setEditing] = useState<NotificationItem | null>(null);

  return (
    <>
      <button
        onClick={() =>
          setEditing({
            title: "",
            message: "",
            type: "info",
            is_active: true,
            start_date: "",
            end_date: "",
          })
        }
        className="btn mb-6 w-full"
      >
        + Add Notification
      </button>

      {editing && (
        <NotificationModal
          initialData={editing}
          onClose={() => setEditing(null)}
          onSaved={(saved: NotificationItem) => {
            setItems((prev) => {
              const exists = prev.find((n) => n._id === saved._id);
              return exists
                ? prev.map((n) => (n._id === saved._id ? saved : n))
                : [saved, ...prev];
            });
          }}
        />
      )}

      <div className="rounded-xl border border-white/10">
        {items.map((n) => (
          <div
            key={n._id}
            className="flex items-center justify-between px-4 py-3 border-b border-white/5"
          >
            <div>
              <p className="font-medium">{n.title}</p>
              <p className="text-xs text-gray-400">{n.type}</p>
            </div>

            <div className="flex items-center gap-3">
              <ActivePill status={n.is_active} />
              <Pen className="cursor-pointer" onClick={() => setEditing(n)} />
              <Trash
                className="cursor-pointer"
                onClick={async () => {
                  await api.post("/admin/notifications/delete", {
                    notification_id: n._id,
                  });
                  setItems(items.filter((i) => i._id !== n._id));
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
