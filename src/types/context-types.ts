import { Dispatch, SetStateAction } from "react";

export interface OrganisationContextType {
  organisation: string | null;
  setOrganisation: Dispatch<SetStateAction<string | null>>;
  loading: boolean;
}
