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
  link: string;
  theme: ThemeType;
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

export interface ThemeType {
  primary_color?: string;
  base_color?: string;
  bg_color?: string;
  sub_color?: string;
  border_color?: string;
  modal_bg_color?: string;
}
