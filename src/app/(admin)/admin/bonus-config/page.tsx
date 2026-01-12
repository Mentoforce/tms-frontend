"use client";
import BonusConfigTable from "@/components/admin/tables/BonusConfigTable";
import BonusTable from "@/components/admin/tables/BonusTable";

import api from "@/lib/axios";
import { RefreshCwIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function TicketPage() {
  const [bonusConfig, setBonusConfig] = useState([]);
  const [total, setTotal] = useState(0);
  const [active, setActive] = useState(0);

  const [loading, setLoading] = useState(false);

  const fetchBonusConfig = async () => {
    setLoading(true);
    try {
      const res = await api.get("subjects/admin/bonus-config");
      console.log(res.data.data);
      setBonusConfig(res.data.data.bonus_config);
      setTotal(res.data.data.totalConfigs);
      setActive(res.data.data.activeConfigs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBonusConfig();
  }, []);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 m-5">
        <div className="rounded-xl border border-white/10 bg-black/40 p-5">
          <p className="text-sm text-gray-400">Total Bonus Config</p>
          <p className="mt-2 text-2xl font-semibold">{total}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/40 p-5">
          <p className="text-sm text-gray-400">Active Bonus Config</p>
          <p className="mt-2 text-2xl font-semibold">{active}</p>
        </div>
      </div>
      {loading ? <></> : <BonusConfigTable config={bonusConfig} />}
    </>
  );
}
