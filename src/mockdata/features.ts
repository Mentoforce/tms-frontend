import { FeatureConfig } from "@/types/context-types";

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
