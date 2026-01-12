import { Dispatch, SetStateAction } from "react";
import { IconProps } from "@tabler/icons-react";

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
  icon: React.FC<IconProps>;
  action: {
    type: FeatureActionType;
    target: string; // modal key OR route
  };
}
