import { Dispatch, SetStateAction } from "react";

export interface OrganisationContextType {
  organisation: OrganisationConfig | null;
  setOrganisation: Dispatch<SetStateAction<OrganisationConfig | null>>;
  loading: boolean;
}

export interface OrganisationConfig {
  code: string;
  name: string;
  logo: string;
  primaryColor: string;
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
