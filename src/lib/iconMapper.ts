import {
  IconWorld,
  IconGift,
  IconUserCheck,
  IconExternalLink,
  IconHelpCircle,
} from "@tabler/icons-react";

/**
 * Central icon registry
 * Backend sends string key → frontend resolves icon safely
 */
export const iconMapper: Record<string, any> = {
  globe: IconWorld,
  gift: IconGift,
  user: IconUserCheck,
  link: IconExternalLink,

  // fallback icon
  default: IconHelpCircle,
};




// import React from "react";
// import { Globe, Gift, User } from "lucide-react";
// import { QuickAccessIconKey } from "@/types/quickAccess";

// // export const quickAccessIcons: Partial<
// //   Record<QuickAccessIconKey, React.ReactNode>
// // > = {
// //   globe: <Globe size={28} />,
// // };

