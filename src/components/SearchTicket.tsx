// "use client";

// import { useState } from "react";
// import api from "@/lib/axios";
// import {
//   IconSearch,
//   IconCheck,
//   IconCircle,
//   IconCircleFilled,
// } from "@tabler/icons-react";

// const DEFAULT_PRIMARY = "#DFD1A1";

// export default function SearchTicket({
//   primarycolor,
// }: {
//   primarycolor?: string;
// }) {
//   const accent = primarycolor || DEFAULT_PRIMARY;

//   const [ticketNumber, setTicketNumber] = useState("");
//   const [username, setUsername] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState<any>(null);
//   const [error, setError] = useState<string | null>(null);

//   const handleSearch = async () => {
//     if (!ticketNumber || !username) {
//       setError("Ticket number and username are required");
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);
//       const res = await api.post("/tickets/search", {
//         ticket_number: ticketNumber,
//         username,
//       });
//       setResult(res.data.data);
//     } catch (err: any) {
//       setError(err?.response?.data?.message || "Ticket not found");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusStyles = (status: string) => {
//     const s = status.toLowerCase();
//     // Green for Created and Resolved/Updated
//     if (
//       s.includes("created") ||
//       s.includes("resolved") ||
//       s.includes("updated")
//     )
//       return "#22C55E";
//     // Red for Rejected
//     if (s.includes("rejected") || s.includes("missed")) return "#EF4444";
//     // Grey for everything else (Pending, Review, Files Missing, etc.)
//     return "#94A3B8";
//   };

//   return (
//     <section className="w-full max-w-360 mx-auto px-4 md:px-6 sm:mb-32 mb-12">
//       <h2 className="mb-6 sm:text-[35px] text-[20px] font-semibold tracking-tight text-[#BDBDBD] uppercase">
//         TRANSACTION INQUIRY
//       </h2>

//       <div
//         className="w-full rounded-3xl sm:min-h-97 flex flex-col px-6 sm:py-10 py-8 md:px-20 md:py-16 gap-6 min-h-100"
//         style={{ backgroundColor: `${accent}1A` }}
//       >
//         {!result ? (
//           <>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="space-y-3">
//                 <label className="text-lg font-semibold text-white">
//                   Ticket ID
//                 </label>
//                 <input
//                   className="w-full sm:h-16 h-12 rounded-lg px-6 bg-[#0C0A06] text-white focus:outline-none mt-3"
//                   placeholder="e.g. 3012-3LIT"
//                   value={ticketNumber}
//                   onChange={(e) => setTicketNumber(e.target.value)}
//                 />
//               </div>
//               <div className="space-y-3">
//                 <label className="text-lg font-semibold text-white">
//                   Username
//                 </label>
//                 <input
//                   className="w-full sm:h-16 h-12 rounded-lg px-6 bg-[#0C0A06] text-white focus:outline-none mt-3"
//                   placeholder="e.g. Elitedesk123"
//                   value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                 />
//               </div>
//             </div>

//             <button
//               onClick={handleSearch}
//               disabled={loading}
//               className="cursor-pointer w-full h-13 rounded-lg font-semibold text-[18px] text-black flex items-center justify-center gap-2"
//               style={{ backgroundColor: accent }}
//             >
//               <IconSearch size={20} stroke={2.5} />
//               {loading ? "Searching..." : "Inquire"}
//             </button>

//             <p className="text-[14px] text-white/80">
//               <span className="opacity-60">Note:</span> You can check the status
//               of your transaction by entering your Ticket ID and username.
//             </p>
//           </>
//         ) : (
//           <div className="animate-in fade-in duration-500">
//             {/* DETAILS SECTION */}
//             <div className="mb-10">
//               <h3 className="text-2xl font-bold text-white mb-4">Details</h3>
//               <div className="grid grid-cols-1 sm:grid-cols-2 text-[15px] sm:gap-y-6">
//                 <div className="space-y-1">
//                   <p className="text-white/40">
//                     Ticket ID:{" "}
//                     <span className="text-white ml-1">
//                       {result.ticket.ticket_number}
//                     </span>
//                   </p>
//                   <p className="text-white/40">
//                     Username:{" "}
//                     <span className="text-white ml-1">{username}</span>
//                   </p>

//                   <p className="text-white/40">
//                     Category:{" "}
//                     <span className="text-white ml-1">
//                       {result.ticket.subject_id?.title} {">"}{" "}
//                       {result.ticket.sub_subject_id?.title}
//                     </span>
//                   </p>
//                 </div>
//                 <div className="space-y-1 text-left">
//                   <p className="text-white/40">
//                     Status:{" "}
//                     <span className="text-white capitalize">
//                       {result.ticket.status}
//                     </span>
//                   </p>

//                   <p className="text-white/40">
//                     Last Update:{" "}
//                     <span className="text-white ml-1">
//                       {new Date(result.ticket.updatedAt).toLocaleDateString(
//                         "en-GB",
//                       )}
//                     </span>
//                   </p>
//                 </div>
//               </div>
//               <hr className="border-white/10 mt-8" />
//             </div>

//             {/* STATUS MONITORING SECTION */}
//             <div>
//               <h3 className="text-2xl font-bold text-white mb-6">
//                 Status Monitoring
//               </h3>
//               <div className="flex flex-col">
//                 {[...result.history].map(
//                   (history: any, index: number, arr: any[]) => {
//                     const color = getStatusStyles(history.action);
//                     const isLast = index === arr.length - 1;
//                     const dateObj = new Date(history.createdAt);

//                     return (
//                       <div key={index} className="flex gap-8 relative">
//                         {/* Vertical Line Segment - Colored by CURRENT status to match icon */}
//                         {!isLast && (
//                           <div
//                             className="absolute left-4 top-8 w-0.5 h-full"
//                             style={{
//                               backgroundColor: color,
//                             }}
//                           />
//                         )}

//                         {/* Status Checkmark Node */}
//                         <div
//                           className="relative z-10 shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
//                           style={{ backgroundColor: color }}
//                         >
//                           <IconCheck
//                             size={18}
//                             className="text-black"
//                             stroke={4}
//                           />
//                         </div>

//                         {/* Status Content */}
//                         <div className="pb-10">
//                           <p className="text-lg font-bold text-white capitalize leading-tight">
//                             {history.action.replace("_", " ")}
//                           </p>
//                           <div className="flex gap-3 items-center text-[14px] text-white/40 mt-2">
//                             <span>
//                               Date:{" "}
//                               <span className="text-white ml-1">
//                                 {dateObj.toLocaleDateString("en-GB")}
//                               </span>
//                             </span>
//                             <IconCircleFilled size={3} />
//                             <span>
//                               Time:{" "}
//                               <span className="text-white ml-1">
//                                 {dateObj.toLocaleTimeString([], {
//                                   hour: "2-digit",
//                                   minute: "2-digit",
//                                   hour12: false,
//                                 })}
//                               </span>
//                             </span>
//                           </div>
//                           {/* <p className="text-[14px] text-white/40 mt-1">
//                             Action By:{" "}
//                             <span className="text-white">
//                               {history.admin_id ? "Admin" : "User"}
//                             </span>
//                           </p> */}

//                           {/* <p className="text-[14px] text-white/60 mt-3">
//                             Action:{" "}
//                             <span className="text-white ml-1">
//                               {history.action}
//                             </span>
//                           </p> */}
//                           {history.comments && (
//                             <div className="mt-1 text-[14px] text-white/40">
//                               Comments:{" "}
//                               <span className="text-white ml-1">
//                                 {history.comments}
//                               </span>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     );
//                   },
//                 )}
//               </div>
//             </div>

//             <button
//               onClick={() => setResult(null)}
//               className=" text-sm underline text-white/40 hover:text-white transition-colors"
//             >
//               Search another ticket
//             </button>
//           </div>
//         )}

//         {error && <p className="text-sm text-red-400 font-medium">{error}</p>}
//       </div>
//     </section>
//   );
// }

"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { IconSearch, IconCheck, IconCircleFilled } from "@tabler/icons-react";

const DEFAULT_PRIMARY = "#DFD1A1";

export default function SearchTicket({
  primarycolor,
}: {
  primarycolor?: string;
}) {
  const accent = primarycolor || DEFAULT_PRIMARY;
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");

  const ddmm = `${day}${month}`;

  const [ticketNumber, setTicketNumber] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!ticketNumber || !username) {
      setError("Ticket number and username are required");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await api.post("/tickets/search", {
        ticket_number: ticketNumber,
        username,
      });
      setResult(res.data.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Ticket not found");
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyles = (status: string) => {
    const s = status.toLowerCase();
    if (
      s.includes("created") ||
      s.includes("resolved") ||
      s.includes("updated")
    )
      return "#22C55E";
    if (s.includes("rejected") || s.includes("missed")) return "#EF4444";
    return "#94A3B8";
  };

  return (
    <section
      className="w-full min-w-82 max-w-90 md:max-w-210 mx-auto px-0 mb-20"
      style={{ color: `${accent}` }}
    >
      {/* SECTION HEADING */}
      <div className="flex flex-col gap-1 mb-6 md:mb-8">
        <h2 className="text-[18px] md:text-[30px] font-semibold md:font-bold uppercase tracking-tight mb-4">
          TRANSACTION INQUIRY
        </h2>
        <div
          className="w-full h-[0.5px] opacity-20"
          style={{ background: `${accent}` }}
        />
      </div>

      <div
        className="w-full rounded-lg md:rounded-xl flex flex-col px-5 py-8 md:px-12 md:py-12 gap-6 border-[0.5px]"
        style={{
          backgroundColor: `${accent}1A`,
          borderColor: `${accent}`,
        }}
      >
        {!result ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-[14px] md:text-[16px] font-semibold">
                  Ticket ID
                </label>
                <input
                  className="w-full h-12 md:h-14 rounded-xl px-4 bg-[#0C0A06] border-[0.5px] border-white/10 focus:outline-none focus:border-white/30 transition-all text-[14px]"
                  placeholder={`e.g. ${ddmm}-3LIT`}
                  value={ticketNumber}
                  onChange={(e) => setTicketNumber(e.target.value)}
                  style={{ borderColor: `${accent}` }}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[14px] md:text-[16px] font-semibold">
                  Username
                </label>
                <input
                  className="w-full h-12 md:h-14 rounded-xl px-4 bg-[#0C0A06] border-[0.5px] focus:outline-none focus:border-white/30 transition-all text-[14px]"
                  placeholder="e.g. Elitedesk123"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{ borderColor: `${accent}` }}
                />
              </div>
            </div>

            <button
              onClick={handleSearch}
              disabled={loading}
              className="cursor-pointer w-full h-12 md:h-14 rounded-xl font-bold text-[16px] text-black flex items-center justify-center gap-2 transition hover:opacity-90 active:scale-[0.98]"
              style={{ backgroundColor: accent }}
            >
              <IconSearch size={20} stroke={2.5} />
              {loading ? "Searching..." : "INQUIRE"}
            </button>

            <p className="text-[11px] font-semibold md:text-[15.5px] opacity-60 leading-relaxed">
              <span className="font-normal">Note:</span> You can check the
              status of your transaction by entering your Ticket ID and
              username.
            </p>
          </>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* DETAILS SECTION */}
            <div className="mb-8">
              <h3 className="text-[18px] md:text-[22px] font-bold mb-6">
                Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 md:gap-y-6 text-[13px] md:text-[15px]">
                <div className="space-y-2">
                  <p>
                    <span className="opacity-60">Ticket ID: </span>
                    <span className=" font-medium ml-1">
                      {result.ticket.ticket_number}
                    </span>
                  </p>
                  <p>
                    <span className="opacity-60">Username: </span>
                    <span className=" font-medium ml-1">{username}</span>
                  </p>
                  <p>
                    <span className="opacity-60">Category: </span>
                    <span className=" font-medium ml-1">
                      {result.ticket.subject_id?.title} ›{" "}
                      {result.ticket.sub_subject_id?.title}
                    </span>
                  </p>
                </div>
                <div className="space-y-2">
                  <p>
                    <span className="opacity-60">Status: </span>
                    <span className=" capitalize font-medium">
                      {result.ticket.status}
                    </span>
                  </p>
                  <p>
                    <span className="opacity-60">Last Update: </span>
                    <span className="font-medium ml-1">
                      {new Date(result.ticket.updatedAt).toLocaleDateString(
                        "en-GB",
                      )}
                    </span>
                  </p>
                </div>
              </div>
              <div className="h-[0.5px] bg-current/10 mt-8" />
            </div>

            {/* STATUS MONITORING SECTION */}
            <div>
              <h3 className="text-[18px] md:text-[22px] font-bold mb-8">
                Status Monitoring
              </h3>
              <div className="flex flex-col">
                {[...result.history].map(
                  (history: any, index: number, arr: any[]) => {
                    const color = getStatusStyles(history.action);
                    const isLast = index === arr.length - 1;
                    const dateObj = new Date(history.createdAt);

                    return (
                      <div key={index} className="flex gap-6 md:gap-8 relative">
                        {!isLast && (
                          <div
                            className="absolute left-3.75 top-8 w-px h-full opacity-30"
                            style={{ backgroundColor: color }}
                          />
                        )}

                        <div
                          className="relative z-10 shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
                          style={{ backgroundColor: color }}
                        >
                          <IconCheck
                            size={16}
                            className="text-black"
                            stroke={4}
                          />
                        </div>

                        <div className="pb-10">
                          <p className="text-[15px] md:text-[17px] font-bold  capitalize leading-tight">
                            {history.action.replace("_", " ")}
                          </p>
                          <div className="flex gap-3 items-center text-[12px] md:text-[13px] opacity-60 mt-2">
                            <span>
                              Date:{" "}
                              <span className="ml-1">
                                {dateObj.toLocaleDateString("en-GB")}
                              </span>
                            </span>
                            <IconCircleFilled size={3} />
                            <span>
                              Time:{" "}
                              <span className=" ml-1">
                                {dateObj.toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: false,
                                })}
                              </span>
                            </span>
                          </div>
                          {history.comments && (
                            <div className="text-xs opacity-60">
                              <span className=" mb-1">Comments: </span>
                              <span className="ml-1">{history.comments}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            </div>

            <button
              onClick={() => setResult(null)}
              className="mt-4 text-[13px] font-medium text-current/40 hover:text-current cursor-pointer underline transition-colors"
            >
              Search another ticket
            </button>
          </div>
        )}

        {error && (
          <p className="text-[13px] text-red-400 font-semibold ">{error}</p>
        )}
      </div>
    </section>
  );
}
