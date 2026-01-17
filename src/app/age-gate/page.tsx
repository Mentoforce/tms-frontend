"use client";

import { useRouter } from "next/navigation";
import AgeGateModal from "@/components/AgeGateModal";

export default function AgeGatePage() {
  const router = useRouter();

  const handleVerified = () => {
    localStorage.setItem("age_verified", "true");

    // Go back to Home (/)
    router.replace("/");
  };

  return <AgeGateModal onVerified={handleVerified} />;
}
