"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { IconSearch, IconCheck } from "@tabler/icons-react";

const DEFAULT_PRIMARY = "#DFD1A1";

export default function SearchTicket({
  primarycolor,
}: {
  primarycolor?: string;
}) {
  const accent = primarycolor || DEFAULT_PRIMARY;

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
    // Green for Created and Resolved/Updated
    if (
      s.includes("created") ||
      s.includes("resolved") ||
      s.includes("updated")
    )
      return "#22C55E";
    // Red for Rejected
    if (s.includes("rejected") || s.includes("missed")) return "#EF4444";
    // Grey for everything else (Pending, Review, Files Missing, etc.)
    return "#94A3B8";
  };

  return (
    <section className="w-full max-w-360 mx-auto px-4 md:px-6 mb-32">
      <h2 className="mb-6 text-[35px] font-semibold tracking-tight text-[#BDBDBD] uppercase">
        TRANSACTION INQUIRY
      </h2>

      <div
        className="w-full rounded-3xl min-h-97 flex flex-col px-6 py-10 md:px-20 md:py-16 gap-6"
        style={{ backgroundColor: `${accent}1A` }}
      >
        {!result ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-lg font-semibold text-white">
                  Ticket ID
                </label>
                <input
                  className="w-full h-16 rounded-lg px-6 bg-[#0C0A06] text-white focus:outline-none mt-3"
                  placeholder="e.g. 3012-3LIT"
                  value={ticketNumber}
                  onChange={(e) => setTicketNumber(e.target.value)}
                />
              </div>
              <div className="space-y-3">
                <label className="text-lg font-semibold text-white">
                  Username
                </label>
                <input
                  className="w-full h-16 rounded-lg px-6 bg-[#0C0A06] text-white focus:outline-none mt-3"
                  placeholder="e.g. Elitedesk123"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={handleSearch}
              disabled={loading}
              className="w-full h-16.5 rounded-lg font-semibold text-[18px] text-black flex items-center justify-center gap-2"
              style={{ backgroundColor: accent }}
            >
              <IconSearch size={20} stroke={2.5} />
              {loading ? "Searching..." : "Inquire"}
            </button>

            <p className="text-[14px] text-white/80">
              <span className="opacity-60">Note:</span> You can check the status
              of your transaction by entering your Ticket ID and username.
            </p>
          </>
        ) : (
          <div className="animate-in fade-in duration-500">
            {/* DETAILS SECTION */}
            <div className="mb-10">
              <h3 className="text-2xl font-bold text-white mb-6">Details</h3>
              <div className="grid grid-cols-2 text-[15px] gap-y-6">
                <div className="space-y-1">
                  <p className="text-white/40">
                    Ticket ID:{" "}
                    <span className="text-white ml-1">
                      {result.ticket.ticket_number}
                    </span>
                  </p>
                  <p className="text-white/40">
                    Status:{" "}
                    <span className="text-white capitalize">
                      {result.ticket.status}
                    </span>
                  </p>
                  <p className="text-white/40">
                    Category:{" "}
                    <span className="text-white ml-1">
                      {result.ticket.subject_id?.title} {">"}{" "}
                      {result.ticket.sub_subject_id?.title}
                    </span>
                  </p>
                </div>
                <div className="text-left  space-y-1">
                  <p className="text-white/40">
                    Username:{" "}
                    <span className="text-white ml-1">{username}</span>
                  </p>
                  <p className="text-white/40">
                    Last Update:{" "}
                    <span className="text-white ml-1">
                      {new Date(result.ticket.updatedAt).toLocaleDateString(
                        "en-GB"
                      )}
                    </span>
                  </p>
                </div>
              </div>
              <hr className="border-white/10 mt-8" />
            </div>

            {/* STATUS MONITORING SECTION */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-10">
                Status Monitoring
              </h3>
              <div className="flex flex-col">
                {[...result.history]
                  .reverse()
                  .map((history: any, index: number, arr: any[]) => {
                    const color = getStatusStyles(history.action);
                    const isLast = index === arr.length - 1;
                    const dateObj = new Date(history.createdAt);

                    return (
                      <div key={index} className="flex gap-8 relative">
                        {/* Vertical Line Segment - Colored by CURRENT status to match icon */}
                        {!isLast && (
                          <div
                            className="absolute left-4 top-8 w-[2px] h-full"
                            style={{
                              backgroundColor: color,
                            }}
                          />
                        )}

                        {/* Status Checkmark Node */}
                        <div
                          className="relative z-10 shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: color }}
                        >
                          <IconCheck
                            size={18}
                            className="text-black"
                            stroke={4}
                          />
                        </div>

                        {/* Status Content */}
                        <div className="pb-10">
                          <p className="text-xl font-bold text-white capitalize leading-tight">
                            {history.action.replace("_", " ")}
                          </p>
                          <div className="flex gap-4 text-[14px] text-white/40 mt-1">
                            <span>
                              Date:{" "}
                              <span className="text-white ml-1">
                                {dateObj.toLocaleDateString("en-GB")}
                              </span>
                            </span>
                            <span>
                              Time:{" "}
                              <span className="text-white ml-1">
                                {dateObj.toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: false,
                                })}
                              </span>
                            </span>
                          </div>
                          <p className="text-[14px] text-white/40 mt-1">
                            Action By:{" "}
                            <span className="text-white">
                              {history.admin_id ? "Admin" : "User"}
                            </span>
                          </p>

                          <p className="text-[14px] text-white/60 mt-3">
                            Action:{" "}
                            <span className="text-white ml-1">
                              {history.action}
                            </span>
                          </p>
                          {history.comments && (
                            <div className="mt-2 text-[14px] text-white/40">
                              Comments:{" "}
                              <span className="text-white ml-1">
                                {history.comments}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            <button
              onClick={() => setResult(null)}
              className="mt-6 text-sm underline text-white/40 hover:text-white transition-colors"
            >
              Search another ticket
            </button>
          </div>
        )}

        {error && <p className="text-sm text-red-400 font-medium">{error}</p>}
      </div>
    </section>
  );
}

//-----------------------------------------------------------------------------------------------------------------------------

// "use client";

// import { useState } from "react";
// import api from "@/lib/axios";

// export default function SearchTicket() {
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
//       setResult(null);

//       const res = await api.post("/tickets/search", {
//         ticket_number: ticketNumber,
//         username,
//       });
//       console.log(res.data.data);
//       setResult(res.data.data);
//     } catch (err: any) {
//       setError(err?.response?.data?.message || "Ticket not found");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto bg-black rounded-lg shadow p-6 space-y-4">
//       <h2 className="text-xl font-semibold text-center">Search Ticket</h2>

//       <input
//         className="input"
//         placeholder="Ticket Number"
//         value={ticketNumber}
//         onChange={(e) => setTicketNumber(e.target.value)}
//       />

//       <input
//         className="input"
//         placeholder="Username"
//         value={username}
//         onChange={(e) => setUsername(e.target.value)}
//       />

//       <button className="btn w-full" onClick={handleSearch} disabled={loading}>
//         {loading ? "Searching..." : "Search"}
//       </button>

//       {/* ERROR */}
//       {error && <p className="text-sm text-red-600 text-center">{error}</p>}

//       {/* RESULT */}
//       {result && (
//         <div className="border rounded p-4 text-sm space-y-1">
//           <p>
//             <strong>Ticket:</strong> {result.ticket.ticket_number}
//           </p>
//           <p>
//             <strong>Status:</strong> {result.ticket.status}
//           </p>
//           <p>
//             <strong>Subject:</strong> {result.ticket.subject_id?.title}
//           </p>
//           <p>
//             <strong>Sub Subject:</strong> {result.ticket.sub_subject_id?.title}
//           </p>
//           <p>
//             <strong>Created:</strong>{" "}
//             {new Date(result.ticket.createdAt).toLocaleString()}
//           </p>
//           {result.history.map((history: any) => {
//             return (
//               <div className="border text-xs space-y-1 border-amber-100">
//                 <p>
//                   <strong>Action By:</strong>{" "}
//                   {history.admin_id
//                     ? `Admin (${history.admin_id.email})`
//                     : "User"}
//                 </p>
//                 <p>
//                   <strong>Action:</strong> {history.action}
//                 </p>
//                 {history.comments && (
//                   <p>
//                     <strong>Comments:</strong> {history.comments}
//                   </p>
//                 )}
//                 <p>
//                   <strong>Date:</strong>{" "}
//                   {new Date(history.createdAt).toLocaleString()}
//                 </p>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }
