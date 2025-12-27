import { OrganisationContextType } from "@/types/context-types";
import {
  createContext,
  useEffect,
  useState,
  ReactNode,
  useContext,
} from "react";

const OrganisationContext = createContext<OrganisationContextType | undefined>(
  undefined
);

export const OrganisationProvider = ({ children }: { children: ReactNode }) => {
  const [organisation, setOrganisation] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedOrg = localStorage.getItem("org_code");
    if (storedOrg) {
      setOrganisation(storedOrg);
    }
    setLoading(false);
  }, []);

  return (
    <OrganisationContext.Provider
      value={{ organisation, setOrganisation, loading }}
    >
      {children}
    </OrganisationContext.Provider>
  );
};

export const useOrganisation = () => {
  const context = useContext(OrganisationContext);

  if (!context) {
    throw new Error("useOrganisation must be used within OrganisationProvider");
  }

  return context;
};
