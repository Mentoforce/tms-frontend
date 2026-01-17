// "use client";

// import { Pen, Trash } from "lucide-react";
// import { useState } from "react";
// import Td from "./util/Td";
// import Th from "./util/Th";
// import api from "@/lib/axios";
// import CreateBonusConfigModal from "./CreateBonusConfigModal";
// import ActivePill from "@/components/ActivePill";

// type BonusConfig = {
//   _id: string;
//   title: string;
//   explanation: string;
//   start_date: Date;
//   end_date: Date;
//   is_active: boolean;
// };

// export default function BonusConfigTable({
//   config,
// }: {
//   config: BonusConfig[];
// }) {
//   const [openModal, setOpenModal] = useState(false);
//   const [editingConfig, setEditingConfig] = useState<any>(null);
//   const [configData, setConfigData] = useState(config || []);

//   if (!config || config.length === 0) {
//     return (
//       <div className="rounded-xl border border-white/10 p-8 text-center text-gray-400">
//         No Bonus List found
//       </div>
//     );
//   }

//   const updateActiveStatus = async (config: BonusConfig) => {
//     await api.post("/subjects/add-bonus-config", {
//       is_active: !config.is_active,
//       bonus_type_id: config._id,
//     });
//     setConfigData((prev) =>
//       prev.map((c) =>
//         c._id === config._id ? { ...c, is_active: !c.is_active } : c
//       )
//     );
//   };

//   const deleteConfig = async (id: string) => {
//     await api.post("/subjects/delete-bonus-config", {
//       bonus_type_id: id,
//     });
//   };
//   return (
//     <>
//       <button
//         onClick={() => {
//           setEditingConfig(null);
//           setOpenModal(true);
//         }}
//         className="btn cursor-pointer mb-10 w-full"
//       >
//         + Create Bonus List Itme
//       </button>
//       <div className="rounded-xl border border-white/10 overflow-hidden">
//         {openModal && (
//           <CreateBonusConfigModal
//             initialData={editingConfig}
//             onClose={() => {
//               setOpenModal(false);
//               setEditingConfig(null);
//             }}
//             onSaved={(saved) => {
//               setConfigData((prev) => {
//                 const exists = prev.find((c) => c._id === saved._id);
//                 return exists
//                   ? prev.map((c) => (c._id === saved._id ? saved : c))
//                   : [saved, ...prev];
//               });
//             }}
//           />
//         )}
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm overflow-x-auto">
//             <thead className="bg-white/5">
//               <tr>
//                 <Th>BONUS TYPE</Th>
//                 <Th>EXPLANATION</Th>
//                 <Th>STATUS</Th>
//                 <Th>VALIDITY</Th>
//                 <Th>UPDATE</Th>
//               </tr>
//             </thead>

//             <tbody>
//               {configData.map((b) => (
//                 <tr
//                   key={b._id}
//                   className="border-t border-white/5 hover:bg-white/5 transition"
//                 >
//                   <Td className="text-gray-400">{b.title}</Td>
//                   <Td className="text-gray-400">
//                     {/* Mobile: truncated */}
//                     <span className="block lg:hidden">
//                       {b.explanation.slice(0, 30)}...
//                     </span>

//                     {/* Desktop: full text */}
//                     <span className="hidden lg:block">{b.explanation}</span>
//                   </Td>

//                   <Td>
//                     <button
//                       className="cursor-pointer"
//                       onClick={() => {
//                         updateActiveStatus(b);
//                       }}
//                     >
//                       <ActivePill status={b.is_active} />
//                     </button>
//                   </Td>

//                   <Td className="text-gray-400">
//                     {new Date(b.start_date).toLocaleDateString()}
//                   </Td>

//                   <Td>
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() => {
//                           setEditingConfig(b);
//                           setOpenModal(true);
//                         }}
//                         className="text-gray-400 hover:text-white cursor-pointer"
//                       >
//                         <Pen size={16} />
//                       </button>
//                       <button
//                         onClick={() => {
//                           deleteConfig(b._id);
//                           setConfigData(
//                             configData.filter((config) => config._id !== b._id)
//                           );
//                         }}
//                         className="text-gray-400 hover:text-white cursor-pointer"
//                       >
//                         <Trash size={16} />
//                       </button>
//                     </div>
//                   </Td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </>
//   );
// }

"use client";

import { Pen, Trash } from "lucide-react";
import { useState } from "react";
import Td from "./util/Td";
import Th from "./util/Th";
import api from "@/lib/axios";
import CreateBonusConfigModal from "./CreateBonusConfigModal";
import ActivePill from "@/components/ActivePill";

type BonusConfig = {
  _id: string;
  title: string;
  explanation: string;
  start_date?: string;
  end_date?: string;
  createdAt?: string;
  is_active: boolean;
};

const formatValidity = (start?: string, end?: string, created?: string) => {
  if (!start && !end) return "No Validity";

  const s = start
    ? new Date(start).toLocaleDateString("en-IN")
    : created
    ? new Date(created).toLocaleDateString("en-IN")
    : "";

  const e = end ? new Date(end).toLocaleDateString("en-IN") : "Infinity";

  return `${s} - ${e}`;
};

export default function BonusConfigTable({
  config,
}: {
  config: BonusConfig[];
}) {
  const [openModal, setOpenModal] = useState(false);
  const [editingConfig, setEditingConfig] = useState<any>(null);
  const [configData, setConfigData] = useState(config || []);

  if (!config || config.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 p-8 text-center text-gray-400">
        No Bonus List found
      </div>
    );
  }

  const updateActiveStatus = async (config: BonusConfig) => {
    await api.post("/subjects/add-bonus-config", {
      is_active: !config.is_active,
      bonus_type_id: config._id,
    });
    setConfigData((prev) =>
      prev.map((c) =>
        c._id === config._id ? { ...c, is_active: !c.is_active } : c
      )
    );
  };

  const deleteConfig = async (id: string) => {
    await api.post("/subjects/delete-bonus-config", {
      bonus_type_id: id,
    });
  };

  return (
    <>
      <button
        onClick={() => {
          setEditingConfig(null);
          setOpenModal(true);
        }}
        className="btn cursor-pointer mb-10 w-full"
      >
        + Create Bonus List Itme
      </button>

      <div className="rounded-xl border border-white/10 overflow-hidden">
        {openModal && (
          <CreateBonusConfigModal
            initialData={editingConfig}
            onClose={() => {
              setOpenModal(false);
              setEditingConfig(null);
            }}
            onSaved={(saved) => {
              setConfigData((prev) => {
                const exists = prev.find((c) => c._id === saved._id);
                return exists
                  ? prev.map((c) => (c._id === saved._id ? saved : c))
                  : [saved, ...prev];
              });
            }}
          />
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm overflow-x-auto">
            <thead className="bg-white/5">
              <tr>
                <Th>BONUS TYPE</Th>
                <Th>EXPLANATION</Th>
                <Th>STATUS</Th>
                <Th>VALIDITY</Th>
                <Th>UPDATE</Th>
              </tr>
            </thead>

            <tbody>
              {configData.map((b) => (
                <tr
                  key={b._id}
                  className="border-t border-white/5 hover:bg-white/5 transition"
                >
                  <Td className="text-gray-400">{b.title}</Td>

                  <Td className="text-gray-400">
                    <span className="block lg:hidden">
                      {b.explanation.slice(0, 30)}...
                    </span>
                    <span className="hidden lg:block">{b.explanation}</span>
                  </Td>

                  <Td>
                    <button
                      className="cursor-pointer"
                      onClick={() => updateActiveStatus(b)}
                    >
                      <ActivePill status={b.is_active} />
                    </button>
                  </Td>

                  <Td className="text-gray-400">
                    {formatValidity(b.start_date, b.end_date, b.createdAt)}
                  </Td>

                  <Td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingConfig(b);
                          setOpenModal(true);
                        }}
                        className="text-gray-400 hover:text-white cursor-pointer"
                      >
                        <Pen size={16} />
                      </button>
                      <button
                        onClick={() => {
                          deleteConfig(b._id);
                          setConfigData(
                            configData.filter((config) => config._id !== b._id)
                          );
                        }}
                        className="text-gray-400 hover:text-white cursor-pointer"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
