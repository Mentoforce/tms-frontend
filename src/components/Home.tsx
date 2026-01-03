"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FeatureCard from "@/components/FeatureCard";
import RaiseTicketModal from "@/components/RaiseTicketModal";
import { handleFeatureAction } from "@/lib/featureHandler";
import { FEATURES } from "@/mockdata/features";
import RequestCallbackModal from "./CallbackRequestModal";
import SearchTicket from "./SearchTicket";

/**
 * Dummy data for now
 * Later → fetch from backend
 */

export default function Home() {
  const router = useRouter();

  /**
   * Central modal registry
   * Easily extensible
   */
  const [openModals, setOpenModals] = useState<Record<string, boolean>>({
    RAISE_TICKET: false,
    REQUEST_CALLBACK: false,
  });

  const openModal = (key: string) =>
    setOpenModals((prev) => ({ ...prev, [key]: true }));

  const closeModal = (key: string) =>
    setOpenModals((prev) => ({ ...prev, [key]: false }));

  return (
    <>
      <RaiseTicketModal
        open={openModals.RAISE_TICKET}
        onClose={() => closeModal("RAISE_TICKET")}
      />
      <RequestCallbackModal
        open={openModals.REQUEST_CALLBACK}
        onClose={() => closeModal("REQUEST_CALLBACK")}
      />

      {/* Header */}
      <div className="p-6">
        <h1 className="text-2xl font-semibold">How can we help you?</h1>
        <p className="text-gray-600 mt-1">Choose one of the options below</p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
        {FEATURES.map((feature) => (
          <FeatureCard
            key={feature.id}
            icon={feature.icon}
            title={feature.title}
            subtitle={feature.subtitle}
            onClick={() => handleFeatureAction(feature, openModal, router)}
          />
        ))}
      </div>
      <SearchTicket />
    </>
  );
}
