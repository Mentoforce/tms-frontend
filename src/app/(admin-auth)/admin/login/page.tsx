"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { useOrganisation } from "@/context/OrganisationProvider";
import SelectOrganisation from "@/components/SelectOrganisation";

export default function AdminLogin() {
  const router = useRouter();
  const { organisation, loading: orgLoading } = useOrganisation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 1️⃣ Wait for organisation resolution
  if (orgLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading organisation...
      </div>
    );
  }

  // 2️⃣ Ask for organisation first
  if (!organisation) {
    return <SelectOrganisation redirectTo="/admin/login" />;
  }

  // 3️⃣ Normal admin login
  const submit = async () => {
    try {
      setLoading(true);
      setError(null);

      await api.post("/login", { email, password });

      router.replace("/admin/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-blue-950 w-full max-w-sm p-6 rounded shadow space-y-4">
        <h2 className="text-xl font-semibold text-center">
          Admin Login — {organisation.name}
        </h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          className="input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn w-full" onClick={submit} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}
