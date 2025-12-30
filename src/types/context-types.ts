import { Dispatch, SetStateAction } from "react";

export interface OrganisationContextType {
  organisation: string | null;
  setOrganisation: Dispatch<SetStateAction<string | null>>;
  loading: boolean;
}

export interface OrganisationConfig {
  code: string;
  name: string;
  logoUrl: string;
  primaryColor: string;
  supportEmail: string;
}

export type FeatureActionType = "modal" | "redirect";

export interface FeatureConfig {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  action: {
    type: FeatureActionType;
    target: string; // modal key OR route
  };
}
