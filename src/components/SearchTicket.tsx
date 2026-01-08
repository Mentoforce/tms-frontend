"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { IconSearch } from "@tabler/icons-react";

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

  const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && ticketNumber && username && !loading) {
      handleSearch();
    }
  };

  return (
    /* SECTION WRAPPER */
    <section className="w-full max-w-360 mx-auto px-4 md:px-6 mb-32">
      {/* SECTION HEADING */}
      <h2 className="mb-6 text-[35px] font-semibold tracking-tight text-[#BDBDBD] uppercase">
        TRANSACTION INQUIRY
      </h2>

      <div
        className="
          w-full
          rounded-3xl
          min-h-97
          flex flex-col justify-center
          px-6 py-10
          md:px-20 md:py-10
          gap-6
        "
        style={{
          backgroundColor: `${accent}1A`,
        }}
      >
        {/* INPUT GRID - Gap 24px per Auto Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ticket ID */}
          <div className="space-y-3">
            <label className="text-[18px] font-semibold text-white">
              Ticket ID
            </label>
            <input
              className="
                w-full
                h-16
                rounded-lg
                px-6
                text-[16px]
                bg-[#0C0A06]
                text-white
                placeholder:text-white/40
                focus:outline-none
              "
              placeholder="e.g. 3012 -3LIT"
              value={ticketNumber}
              onChange={(e) => setTicketNumber(e.target.value)}
              onKeyDown={handleEnterKey}
            />
          </div>

          {/* Username */}
          <div className="space-y-3">
            <label className="text-[18px] font-semibold text-white">
              Username
            </label>
            <input
              className="
                w-full
                h-16
                rounded-lg
                px-6
                text-[16px]
                bg-[#0C0A06]
                text-white
                placeholder:text-white/40
                focus:outline-none
              "
              placeholder="e.g. Elitedesk123"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleEnterKey}
            />
          </div>
        </div>

        <button
          onClick={handleSearch}
          disabled={loading}
          className="
            w-full
            h-16.5
            rounded-lg
            font-semibold
            text-[18px]
            text-black
            transition
            disabled:opacity-50
            flex items-center justify-center gap-2
          "
          style={{
            backgroundColor: accent,
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          <IconSearch size={20} stroke={2.5} />
          {loading ? "Searching..." : "Inquire"}
        </button>

        {/* NOTE */}
        <p className="text-[14px] text-white/80">
          <span className="opacity-60">Note:</span> You can check the status of
          your transaction by entering your Ticket ID and username.
        </p>

        {/* ERROR */}
        {error && <p className="text-sm text-red-400">{error}</p>}

        {/* RESULT (Functionality preserved) */}
        {result && (
          <div className="rounded-xl p-4 space-y-3 text-sm text-white/80">
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
              <strong>Sub Subject:</strong>{" "}
              {result.ticket.sub_subject_id?.title}
            </p>
            <p>
              <strong>Created:</strong>{" "}
              {new Date(result.ticket.createdAt).toLocaleString()}
            </p>
            {result.history.map((history: any) => {
              return (
                <div className="border text-xs space-y-1 ">
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
              );
            })}
          </div>
        )}
      </div>
    </section>
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
