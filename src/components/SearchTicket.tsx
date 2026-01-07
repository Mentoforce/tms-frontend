"use client";

import { useState } from "react";
import api from "@/lib/axios";

const DEFAULT_PRIMARY = "#AD9E70";

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
      setResult(null);

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

  return (
    <div
      className="max-w-md mx-auto rounded-2xl shadow p-6 space-y-5"
      style={{
        backgroundColor: `${accent}26`, // ~15% opacity
        border: `1px solid ${accent}`,
      }}
    >
      <h2
        className="text-xl font-semibold text-center"
        style={{ color: accent }}
      >
        Transaction Inquiry
      </h2>

      {/* Ticket ID */}
      <input
        className="w-full rounded-lg px-4 py-3 text-sm bg-black/60 text-white placeholder:text-white/40 focus:outline-none"
        style={{ border: `1px solid ${accent}` }}
        placeholder="e.g. 3012-3LIT"
        value={ticketNumber}
        onChange={(e) => setTicketNumber(e.target.value)}
      />

      {/* Username */}
      <input
        className="w-full rounded-lg px-4 py-3 text-sm bg-black/60 text-white placeholder:text-white/40 focus:outline-none"
        style={{ border: `1px solid ${accent}` }}
        placeholder="e.g. Elitedesk123"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      {/* Search Button */}
      <button
        onClick={handleSearch}
        disabled={loading}
        className="w-full py-3 rounded-lg font-bold text-black transition disabled:opacity-50"
        style={{ backgroundColor: accent }}
      >
        {loading ? "Searching..." : "🔍 Inquire"}
      </button>

      {/* Note */}
      <p className="text-xs text-white/60">
        You can check the status of your transaction by entering your Ticket ID
        and username.
      </p>

      {/* ERROR */}
      {error && <p className="text-sm text-red-400 text-center">{error}</p>}

      {/* RESULT */}
      {result && (
        <div
          className="rounded-lg p-4 text-sm space-y-2 text-white/80"
          style={{ border: `1px solid ${accent}` }}
        >
          <p>
            <strong>Ticket:</strong> {result.ticket.ticket_number}
          </p>
          <p>
            <strong>Status:</strong> {result.ticket.status}
          </p>
          <p>
            <strong>Subject:</strong> {result.ticket.subject_id?.title}
          </p>
          <p>
            <strong>Sub Subject:</strong> {result.ticket.sub_subject_id?.title}
          </p>
          <p>
            <strong>Created:</strong>{" "}
            {new Date(result.ticket.createdAt).toLocaleString()}
          </p>

          {/* History */}
          {result.history.map((history: any, idx: number) => (
            <div
              key={idx}
              className="rounded-md p-3 text-xs space-y-1"
              style={{ border: `1px solid ${accent}` }}
            >
              <p>
                <strong>Action By:</strong>{" "}
                {history.admin_id
                  ? `Admin (${history.admin_id.email})`
                  : "User"}
              </p>
              <p>
                <strong>Action:</strong> {history.action}
              </p>
              {history.comments && (
                <p>
                  <strong>Comments:</strong> {history.comments}
                </p>
              )}
              <p>
                <strong>Date:</strong>{" "}
                {new Date(history.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

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
