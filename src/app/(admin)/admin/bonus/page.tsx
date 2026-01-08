"use client";
import BonusTable from "@/components/admin/tables/BonusTable";
import CallbackRequestTable from "@/components/admin/tables/CallbackReqTable";
import SkeletonTable from "@/components/admin/tables/TicketSkeletonTable";
import BonusClaimModal from "@/components/BonusClaimModal";
import { useDebounce } from "@/hooks/useDebounce";
import api from "@/lib/axios";
import { RefreshCwIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function TicketPage() {
  const [bonus, setBonus] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useDebounce(search, 400);

  const fetchBonus = async () => {
    setLoading(true);
    try {
      const res = await api.get("/tickets/bonus", {
        params: {
          search: debouncedSearch,
          status,
        },
      });
      setBonus(res.data.data);
      // setTotal(res.data.data.total);
    } finally {
      setLoading(false);
    }
  };

  const handleBonusUpdate = (updatedBonus: any) => {
    setBonus((prev: any) =>
      prev.map((b: any) => (b._id === updatedBonus._id ? updatedBonus : b))
    );
  };
  // <CallbackRequestTable
  //   callback={callback}
  //   onCallbackUpdated={handleCallbackUpdate}
  // />;
  useEffect(() => {
    fetchBonus();
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
          <option value="review">Under Review</option>
          <option value="resolved">Resolved</option>
          <option value="rejected">Rejected</option>
        </select>

        <button
          onClick={fetchBonus}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border"
        >
          <RefreshCwIcon />
          Refresh
        </button>
      </div>

      {loading ? (
        <SkeletonTable type="Bonus" />
      ) : (
        <BonusTable bonus={bonus} onBonusUpdated={handleBonusUpdate} />
      )}
    </>
  );
}
