"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useOrganisation } from "@/context/OrganisationProvider";
import api from "@/lib/axios";

export default function SelectOrganisation({
  redirectTo,
}: {
  redirectTo?: string;
}) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { setOrganisation } = useOrganisation();

  const handleSubmit = async () => {
    if (!code.trim()) {
      setError("Organisation code is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await api.post("/check-org", {
        code: code.trim(),
      });

      localStorage.setItem("org_code", code.trim());
      setOrganisation(res.data.data);

      if (redirectTo) {
        router.replace(redirectTo);
      }
    } catch (err: any) {
      const status = err?.response?.status;
      if (err.status == 404) setError("Organisation not found");
      else setError(err.message);

      if (status === 404) {
        setError("Organisation not found");
      } else {
        setError(
          err?.response?.data?.message || "Failed to validate organisation",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-6 rounded-lg shadow">
        <h1 className="text-xl font-semibold mb-4">Enter Organisation Code</h1>

        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Organisation Code"
          className="w-full border px-3 py-2 rounded mb-3"
        />

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded"
        >
          {loading ? "Validating..." : "Continue"}
        </button>
      </div>
    </div>
  );
}
