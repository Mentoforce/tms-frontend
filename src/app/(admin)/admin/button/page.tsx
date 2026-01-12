"use client";
import ButtonTable from "@/components/admin/tables/ButtonTable";
import api from "@/lib/axios";
import { RefreshCwIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function TicketPage() {
  const [buttons, setButtons] = useState([]);
  const [total, setTotal] = useState(0);
  const [active, setActive] = useState(0);

  const [loading, setLoading] = useState(false);

  const fetchButtons = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/buttons");
      console.log(res.data.data);
      setButtons(res.data.data.buttons);
      setTotal(res.data.data.total_buttons);
      setActive(res.data.data.active_buttons);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchButtons();
  }, []);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 m-5">
        <div className="rounded-xl border border-white/10 bg-black/40 p-5">
          <p className="text-sm text-gray-400">Total Buttons</p>
          <p className="mt-2 text-2xl font-semibold">{total}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/40 p-5">
          <p className="text-sm text-gray-400">Active Buttons</p>
          <p className="mt-2 text-2xl font-semibold">{active}</p>
        </div>
      </div>
      {loading ? <></> : <ButtonTable config={buttons} />}
    </>
  );
}
