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
