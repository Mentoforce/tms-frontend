"use client";

import { Eye } from "lucide-react";
import { useState } from "react";
import { transformStatus } from "@/lib/tableUtils";
import Td from "./util/Td";
import Th from "./util/Th";
import BonusViewModal from "./BonusViewModal";
import api from "@/lib/axios";

type Bonus = {
  _id: string;
  username: string;
  status: any; //"pending" | "updated" | "resolved" | "rejected";
  createdAt: string;
  updatedAt: string;
  bonus_type_id: any;
  remarks?: string;
};

const BONUS_STATUS_CLASS_MAP: Record<string, string> = {
  pending: "bg-blue-500/15 text-blue-400",
  review: "bg-yellow-500/15 text-yellow-400",
  resolved: "bg-green-500/15 text-green-400",
  rejected: "bg-red-500/15 text-red-400",
};

export default function BonusTable({
  bonus,
  onBonusUpdated,
}: {
  bonus: Bonus[];
  onBonusUpdated: (updatedBonus: any) => void;
}) {
  const [selectedBonus, setSelectedBonus] = useState<any>(null);
  const updateBonusStatus = async (bonus: Bonus, newStatus: string) => {
    await api.post("/tickets/update-bonus", {
      bonus_id: bonus._id,
      status: newStatus,
    });

    onBonusUpdated({
      ...bonus,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    });
  };

  if (!bonus || bonus.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 p-8 text-center text-gray-400">
        No Bonus Claims found
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 overflow-hidden">
      {selectedBonus && (
        <BonusViewModal
          bonus={selectedBonus}
          onClose={() => setSelectedBonus(null)}
          onUpdated={(updatedBonus) => {
            onBonusUpdated(updatedBonus);
            setSelectedBonus(null);
          }}
        />
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm overflow-x-auto">
          <thead className="bg-white/5">
            <tr>
              <Th>USER</Th>
              <Th>BONUS TYPE</Th>
              <Th>SITUATION</Th>
              <Th>HISTORY</Th>
              <Th>VIEW</Th>
            </tr>
          </thead>

          <tbody>
            {bonus.map((b) => (
              <tr
                key={b._id}
                className="border-t border-white/5 hover:bg-white/5 transition text-center"
              >
                <Td className="flex items-center gap-2">
                  <span className="h-7 w-7 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs">
                    {b.username?.[0]?.toUpperCase()}
                  </span>
                  {b.username}
                </Td>
                <Td className="text-gray-400">{b.bonus_type_id.title}</Td>

                <Td>
                  {b.status !== "resolved" ? (
                    <BonusStatusDropdown
                      status={b.status}
                      onChange={(newStatus) => updateBonusStatus(b, newStatus)}
                    />
                  ) : (
                    <StatusPill status={b.status} />
                  )}
                </Td>

                <Td className="text-gray-400">
                  {new Date(b.updatedAt).toLocaleDateString()}
                </Td>

                <Td>
                  <button
                    onClick={() => setSelectedBonus(b)}
                    className="text-gray-400 hover:text-white"
                  >
                    <Eye size={16} />
                  </button>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: Bonus["status"] }) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${BONUS_STATUS_CLASS_MAP[status]}`}
    >
      {transformStatus(status)}
    </span>
  );
}

function BonusStatusDropdown({
  status,
  onChange,
}: {
  status: string;
  onChange: (status: string) => void;
}) {
  const [open, setOpen] = useState(false);

  const STATUSES = ["pending", "review", "resolved", "rejected"];

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${BONUS_STATUS_CLASS_MAP[status]}`}
      >
        {transformStatus(status)}
        <span className="opacity-60">▾</span>
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-44 rounded-lg border border-white/10 bg-[#0B0F1A] shadow-lg">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => {
                onChange(s);
                setOpen(false);
              }}
              className="w-full text-left px-3 py-2 hover:bg-white/5 first:rounded-t-lg last:rounded-b-lg"
            >
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${BONUS_STATUS_CLASS_MAP[s]}`}
              >
                {transformStatus(s)}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// "use client";

// import { Eye } from "lucide-react";
// import { useState } from "react";
// import { transformStatus } from "@/lib/tableUtils";
// import Td from "./util/Td";
// import Th from "./util/Th";
// import BonusViewModal from "./BonusViewModal";

// type Bonus = {
//   _id: string;
//   username: string;
//   status: any;
//   createdAt: string;
//   updatedAt: string;
//   bonus_type_id: any;
//   remarks?: string;
// };

// const formatValidity = (created?: string, updated?: string) => {
//   if (!created && !updated) return "No History";

//   const s = created ? new Date(created).toLocaleDateString("en-IN") : "";

//   const e = updated
//     ? new Date(updated).toLocaleDateString("en-IN")
//     : "Infinity";

//   return `${s} - ${e}`;
// };

// export default function BonusTable({
//   bonus,
//   onBonusUpdated,
// }: {
//   bonus: Bonus[];
//   onBonusUpdated: (updatedBonus: any) => void;
// }) {
//   const [selectedBonus, setSelectedBonus] = useState<any>(null);

//   if (!bonus || bonus.length === 0) {
//     return (
//       <div className="rounded-xl border border-white/10 p-8 text-center text-gray-400">
//         No Bonus Claims found
//       </div>
//     );
//   }

//   return (
//     <div className="rounded-xl border border-white/10 overflow-hidden">
//       {selectedBonus && (
//         <BonusViewModal
//           bonus={selectedBonus}
//           onClose={() => setSelectedBonus(null)}
//           onUpdated={(updatedBonus) => {
//             onBonusUpdated(updatedBonus);
//             setSelectedBonus(null);
//           }}
//         />
//       )}

//       <div className="overflow-x-auto">
//         <table className="w-full text-sm overflow-x-auto">
//           <thead className="bg-white/5">
//             <tr>
//               <Th>USER</Th>
//               <Th>BONUS TYPE</Th>
//               <Th>SITUATION</Th>
//               <Th>HISTORY</Th>
//               <Th>VIEW</Th>
//             </tr>
//           </thead>

//           <tbody>
//             {bonus.map((b) => (
//               <tr
//                 key={b._id}
//                 className="border-t border-white/5 hover:bg-white/5 transition text-center"
//               >
//                 <Td className="flex items-center gap-2">
//                   <span className="h-7 w-7 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs">
//                     {b.username?.[0]?.toUpperCase()}
//                   </span>
//                   {b.username}
//                 </Td>

//                 <Td className="text-gray-400">{b.bonus_type_id.title}</Td>

//                 <Td>
//                   <StatusPill status={b.status} />
//                 </Td>

//                 <Td className="text-gray-400">
//                   {formatValidity(b.createdAt, b.updatedAt)}
//                 </Td>

//                 <Td>
//                   <button
//                     onClick={() => setSelectedBonus(b)}
//                     className="text-gray-400 hover:text-white"
//                   >
//                     <Eye size={16} />
//                   </button>
//                 </Td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// function StatusPill({ status }: { status: Bonus["status"] }) {
//   const map: Record<string, string> = {
//     pending: "bg-blue-500/15 text-blue-400",
//     created: "bg-blue-500/15 text-blue-400",
//     resolved: "bg-green-500/15 text-green-400",
//     rejected: "bg-red-500/15 text-red-400",
//     review: "bg-yellow-500/15 text-yellow-400",
//   };

//   return (
//     <span
//       className={`px-3 py-1 rounded-full text-xs font-medium ${map[status]}`}
//     >
//       {transformStatus(status)}
//     </span>
//   );
// }
