"use client";

import HomePage from "@/components/Home";
import SelectOrganisation from "@/components/SelectOrganisation";
import { useOrganisation } from "@/context/OrganisationProvider";

export default function Home() {
  const { organisation, loading } = useOrganisation();

  if (loading) {
    return (
      //LOADING SCREEN
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }
  if (!organisation) {
    return <SelectOrganisation />;
  }

  // Organisation resolved → show support UI
  return <HomePage />;
}
