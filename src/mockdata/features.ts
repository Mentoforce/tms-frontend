import { FeatureConfig } from "@/types/context-types";

export const FEATURES: FeatureConfig[] = [
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
    id: "bonus-claim",
    title: "Bonus Claim",
    subtitle: "Claim your Bonus",
    icon: "🔍",
    action: {
      type: "modal",
      target: "BONUS_CLAIM",
    },
  },
  {
    id: "upload-file",
    title: "Upload File",
    subtitle: "Upload File to existing Ticket",
    icon: "🔍",
    action: {
      type: "modal",
      target: "UPLOAD_FILE",
    },
  },
];
