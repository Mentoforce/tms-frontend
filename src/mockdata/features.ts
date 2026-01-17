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
  },
    {
    id: "send-whatsapp",
    title: "Whatsapp",
    subtitle: "Send whatsapp to us",
    icon: IconBrandWhatsapp,
    action: {
      type: "redirect",
      target: "https://wa.me/919899598446",
    },
  },
    {
    id: "send-telegram",
    title: "Telegram",
    subtitle: "Member Support Line",
    icon: IconBrandTelegram,
    action: {
      type: "redirect",
      target: "https://t.me/your_telegram_username",
    },
  },
  {
    id: "send-expressmail",
    title: "Express Mail",
    subtitle: "Fast Communication via Email",
    icon: IconMail,
    action: {
      type: "redirect",
      target: "mailto:support@yourdomain.com",
    },
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
  },


];
