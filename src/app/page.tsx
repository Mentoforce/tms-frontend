"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import HomePage from "@/components/Home";
import { useOrganisation } from "@/context/OrganisationProvider";
import SelectOrganisation from "@/components/SelectOrganisation";

export default function HomeRoute() {
  const { organisation, loading } = useOrganisation();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!organisation) return;

    const verified = localStorage.getItem("age_verified");
    if (!verified) {
      router.replace("/age-gate");
    }
  }, [loading, organisation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!organisation) {
    return <SelectOrganisation />;
  }

  if (!localStorage.getItem("age_verified")) {
    return null;
  }

  return <HomePage />;
}
