"use client";

import { useState } from "react";
import api from "@/lib/axios";

export default function SearchTicket() {
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
      console.log(res.data.data);
      setResult(res.data.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Ticket not found");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-black rounded-lg shadow p-6 space-y-4">
      <h2 className="text-xl font-semibold text-center">Search Ticket</h2>

      <input
        className="input"
        placeholder="Ticket Number"
        value={ticketNumber}
        onChange={(e) => setTicketNumber(e.target.value)}
      />

      <input
        className="input"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <button className="btn w-full" onClick={handleSearch} disabled={loading}>
        {loading ? "Searching..." : "Search"}
      </button>

      {/* ERROR */}
      {error && <p className="text-sm text-red-600 text-center">{error}</p>}

      {/* RESULT */}
      {result && (
        <div className="border rounded p-4 text-sm space-y-1">
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
          {result.history.map((history: any) => {
            return (
              <div className="border text-xs space-y-1 border-amber-100">
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
  );
}
