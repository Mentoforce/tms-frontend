"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FeatureCard from "@/components/FeatureCard";
import RaiseTicketModal from "@/components/RaiseTicketModal";
import { FeatureConfig } from "@/types/context-types";
import { handleFeatureAction } from "@/lib/featureHandler";
import Navbar from "./Navbar";
// import QuickAccess from "./QuickAccess";
import { useOrganisation } from "@/context/OrganisationProvider";

/**
 * Dummy data for now
 * Later → fetch from backend
 */
const FEATURES: FeatureConfig[] = [
  {
    id: "raise-ticket",
    title: "Raise a Ticket",
    subtitle: "Report an issue or request support",
    icon: "🎫",
    action: {
      type: "modal",
      target: "RAISE_TICKET",
    },
  },
  {
    id: "request-callback",
    title: "Request Callback",
    subtitle: "Ask us to call you back",
    icon: "📞",
    action: {
      type: "modal",
      target: "REQUEST_CALLBACK",
    },
  },
  {
    id: "track-ticket",
    title: "Track Ticket",
    subtitle: "Check your ticket status",
    icon: "🔍",
    action: {
      type: "redirect",
      target: "/track-ticket",
    },
  },
];

export default function Home() {
  const router = useRouter();
  const { organisation } = useOrganisation();
  const { logo, primaryColor } = organisation!;
  console.log(organisation);

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
      <Navbar
        config={{
          logoUrl: logo,
          lineColor: primaryColor,
        }}
      />
      {/* <QuickAccess /> */}

      <RaiseTicketModal
        open={openModals.RAISE_TICKET}
        onClose={() => closeModal("RAISE_TICKET")}
      />

      {/* Header
      <div className="p-6">
        <h1 className="text-2xl font-semibold">How can we help you?</h1>
        <p className="text-gray-600 mt-1">Choose one of the options below</p>
      </div> */}

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

      {/* Modals */}

      {/* Placeholder for future */}
      {/* 
      <RequestCallbackModal
        opened={openModals.REQUEST_CALLBACK}
        onClose={() => closeModal("REQUEST_CALLBACK")}
      /> 
      */}
    </>
  );
}
