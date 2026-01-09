import { FeatureConfig } from "@/types/context-types";
import {
  IconTicket,
  IconPhoneCall,
  IconBrandWhatsapp,
  IconBrandTelegram,
  IconMail,
  IconUpload,
  IconGift,
} from "@tabler/icons-react";

export const FEATURES: FeatureConfig[] = [
  {
    id: "raise-ticket",
    title: "Quick Support",
    subtitle: "Submit a quick support request",
    icon: IconTicket,
    action: {
      type: "modal",
      target: "RAISE_TICKET",
    },
    // primarycolor: "#AD9E70",
  },
  {
    id: "request-callback",
    title: "Phone Me",
    subtitle: "Request a call and we'll contact you",
    icon: IconPhoneCall,
    action: {
      type: "modal",
      target: "REQUEST_CALLBACK",
    },
    // primarycolor: "#AD9E70",
  },
  {
    id: "bonus-claim",
    title: "Bonus Claim",
    subtitle: "Claim your Bonus",
    icon: IconGift,
    action: {
      type: "modal",
      target: "BONUS_CLAIM",
    },
    // primarycolor: "#AD9E70",
  },
  {
    id: "upload-file",
    title: "Upload File",
    subtitle: "Upload a file to your current request",
    icon: IconUpload,
    action: {
      type: "modal",
      target: "UPLOAD_FILE",
    },
    // primarycolor: "#AD9E70",
  },
  {
    id: "send-whatsapp",
    title: "Send Whatsapp",
    subtitle: "Send whatsapp to us",
    icon: IconBrandWhatsapp,
    action: {
      type: "redirect",
      target: "https://wa.me/919899598446",
    },
    // primarycolor: "#AD9E70",
  },
];
