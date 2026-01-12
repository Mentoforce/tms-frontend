"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FeatureCard from "@/components/FeatureCard";
import RaiseTicketModal from "@/components/RaiseTicketModal";
import { handleFeatureAction } from "@/lib/featureHandler";
import Navbar from "./Navbar";
// import QuickAccess from "./QuickAccess";
import { useOrganisation } from "@/context/OrganisationProvider";
import { FEATURES } from "@/mockdata/features";
import RequestCallbackModal from "./CallbackRequestModal";
import SearchTicket from "./SearchTicket";
import BonusClaimModal from "./BonusClaimModal";
import UploadFileModal from "./UploadFileModal";
import Footer from "./Footer";

/**
 * Dummy data for now
 * Later → fetch from backend
 */

export default function Home() {
  const router = useRouter();
  const { organisation } = useOrganisation();
  const { logo, primaryColor } = organisation!;

  /**
   * Central modal registry
   * Easily extensible
   */
  const [openModals, setOpenModals] = useState<Record<string, boolean>>({
    RAISE_TICKET: false,
    REQUEST_CALLBACK: false,
    BONUS_CLAIM: false,
    UPLOAD_FILE: false,
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
        primarycolor={primaryColor}
      />
      <RequestCallbackModal
        open={openModals.REQUEST_CALLBACK}
        onClose={() => closeModal("REQUEST_CALLBACK")}
        primarycolor={primaryColor}
      />
      <BonusClaimModal
        open={openModals.BONUS_CLAIM}
        onClose={() => closeModal("BONUS_CLAIM")}
        primarycolor={primaryColor}
      />
      <UploadFileModal
        open={openModals.UPLOAD_FILE}
        onClose={() => closeModal("UPLOAD_FILE")}
        primarycolor={primaryColor}
      />

      {/* Feature Cards */}
      <section className="w-full max-w-360 mx-auto px-4 md:px-6 mb-32">
        <h2 className="mb-6 text-[35px] font-semibold tracking-tight text-[#BDBDBD] uppercase">
          QUICK SUPPORT
        </h2>

        {/* FEATURE CARDS GRID*/}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 w-full gap-6 ">
          {FEATURES.map((feature) => (
            <FeatureCard
              key={feature.id}
              icon={feature.icon}
              title={feature.title}
              subtitle={feature.subtitle}
              onClick={() => handleFeatureAction(feature, openModal, router)}
              primarycolor={primaryColor}
            />
          ))}
        </div>
      </section>

      <SearchTicket primarycolor={primaryColor} />
      <Footer primarycolor={primaryColor} />
    </>
  );
}
