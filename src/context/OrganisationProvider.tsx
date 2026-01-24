"use client";
import api from "@/lib/axios";
import {
  OrganisationConfig,
  OrganisationContextType,
} from "@/types/context-types";
import {
  createContext,
  useEffect,
  useState,
  ReactNode,
  useContext,
} from "react";

const OrganisationContext = createContext<OrganisationContextType | undefined>(
  undefined,
);

export const OrganisationProvider = ({ children }: { children: ReactNode }) => {
  const [organisation, setOrganisation] = useState<OrganisationConfig | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOrganisation = async () => {
      const storedOrg = localStorage.getItem("org_code");

      if (!storedOrg) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.post(
          "/check-org",
          { code: storedOrg.trim() },
          {
            headers: { "Content-Type": "application/json" },
          },
        );
        setOrganisation(res.data.data);
      } catch (error) {
        console.error("Failed to fetch organisation", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganisation();
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
