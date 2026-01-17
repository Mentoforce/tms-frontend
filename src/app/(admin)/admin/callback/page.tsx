"use client";
import CallbackRequestTable from "@/components/admin/tables/CallbackReqTable";
import SkeletonTable from "@/components/admin/tables/TicketSkeletonTable";
import { useDebounce } from "@/hooks/useDebounce";
import api from "@/lib/axios";
import { RefreshCwIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function TicketPage() {
  const [callback, setCallback] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useDebounce(search, 400);

  const fetchCallbackRequests = async () => {
    setLoading(true);
    try {
      const res = await api.get("/tickets/callbacks", {
        params: {
          search: debouncedSearch,
          status,
        },
      });
      console.log(res.data.data);
      setCallback(res.data.data);
      // setTotal(res.data.data.total);
    } finally {
      setLoading(false);
    }
  };

  const handleCallbackUpdate = (updatedCallback: any) => {
    setCallback((prev: any) =>
      prev.map((c: any) =>
        c._id === updatedCallback._id ? updatedCallback : c
      )
    );
  };
  <CallbackRequestTable
    callback={callback}
    onCallbackUpdated={handleCallbackUpdate}
  />;
  useEffect(() => {
    fetchCallbackRequests();
  }, [debouncedSearch, status]);

  return (
    <>
      <div className="flex gap-4 m-2 my- flex-wrap">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by request ID, username, or description..."
          className="w-full bg-transparent border border-black px-3 py-3 rounded-md"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="bg-slate-900 border rounded-lg px-3 py-2"
        >
          <option value="all">All Cases</option>
          <option value="pending">Pending</option>
          <option value="missed">Missed Call</option>
          <option value="resolved">Resolved</option>
          <option value="rejected">Rejected</option>
        </select>

        <button
          onClick={fetchCallbackRequests}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border"
        >
          <RefreshCwIcon />
          Refresh
        </button>
      </div>

      {loading ? (
        <SkeletonTable type="Callback" />
      ) : (
        <CallbackRequestTable
          callback={callback}
          onCallbackUpdated={handleCallbackUpdate}
        />
      )}
    </>
  );
}
