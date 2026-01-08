"use client";
import SkeletonTable from "@/components/admin/tables/TicketSkeletonTable";
import TicketTable from "@/components/admin/tables/TicketTable";
import { useDebounce } from "@/hooks/useDebounce";
import api from "@/lib/axios";
import { RefreshCwIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function TicketPage() {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useDebounce(search, 400);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await api.get("/tickets", {
        params: {
          search: debouncedSearch,
          status,
        },
      });

      setTickets(res.data.data.tickets);
      setTotal(res.data.data.total);
    } finally {
      setLoading(false);
    }
  };

  const handleTicketUpdated = (updatedTicket: any) => {
    setTickets((prev: any) =>
      prev.map((t: any) => (t._id === updatedTicket._id ? updatedTicket : t))
    );
  };

  <TicketTable tickets={tickets} onTicketUpdated={handleTicketUpdated} />;
  useEffect(() => {
    fetchTickets();
  }, [debouncedSearch, status]);

  return (
    <>
      <div className="flex gap-4 m-2 my-10">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by request ID, username, or description..."
          className="w-full bg-transparent border border-black px-3"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="bg-black border rounded-lg px-3 py-2"
        >
          <option value="all">All Cases</option>
          <option value="pending">Pending</option>
          <option value="updated">Updated</option>
          <option value="files_missing">Files Missing</option>
          <option value="resolved">Resolved</option>
          <option value="rejected">Rejected</option>
        </select>

        <button
          onClick={fetchTickets}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border"
        >
          <RefreshCwIcon />
          Refresh
        </button>
      </div>

      {loading ? (
        <SkeletonTable type="Ticket" />
      ) : (
        <TicketTable tickets={tickets} onTicketUpdated={handleTicketUpdated} />
      )}
    </>
  );
}
