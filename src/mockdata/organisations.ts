import { OrganisationConfig } from "../types/context-types";

export const ORGANISATIONS: Record<string, any> = {
  MTF: {
    code: "MTF",
    name: "Mentoforce Technologies",
    logoUrl: "/logos/mentoforce.png",
    primaryColor: "#000000",
    supportEmail: "support@mentoforce.com",
  },
  ACME: {
    code: "ACME",
    name: "Acme Corp",
    logoUrl: "/logos/acme.png",
    primaryColor: "#2563eb",
    supportEmail: "help@acme.com",
  },
};

export interface TicketDraft {
  username: string;
  subjectId: string | null;
  subSubjectId: string | null;
  description: string;
  audioBlob?: Blob;
  files: {
    file: File;
    name: string;
  }[];
  returnChannel: "whatsapp" | "telegram" | "telephone" | "email" | null;
}

