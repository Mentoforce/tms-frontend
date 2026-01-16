"use client";

import { useOrganisation } from "@/context/OrganisationProvider";
import api from "@/lib/axios";
import { useEffect, useState } from "react";

export default function OrganisationPage() {
  const { organisation } = useOrganisation();

  const [loading, setLoading] = useState(false);
  const [org, setOrg] = useState<any>(null);

  const [primaryColor, setPrimaryColor] = useState("#000000");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  /* ---------------- CHECK ORG ---------------- */
  const checkOrganisation = async () => {
    if (!organisation) return;

    setLoading(true);
    try {
      const res = await api.post("/check-org", { code: organisation.code });
      setOrg(res.data.data);
      setPrimaryColor(res.data.data?.primaryColor || "#000000");
      setLogoPreview(res.data.data?.logo || null);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UPDATE ORG ---------------- */
  const updateOrganisation = async () => {
    const formData = new FormData();
    formData.append("primaryColor", primaryColor);

    if (logoFile) {
      formData.append("logo", logoFile);
    }

    await api.post("/update-org", formData);

    checkOrganisation();
  };

  useEffect(() => {
    checkOrganisation();
  }, []);

  return (
    <div className="max-w-full w-full space-y-6 overflow-x-hidden">
      <h1 className="text-xl font-semibold">Organisation Settings</h1>

      {org && (
        <>
          <div className="rounded-lg border border-white/10 p-4 space-y-6">
            <p className="text-sm text-gray-400">
              Organisation:
              <span className="text-white font-medium">{org.name}</span>
            </p>

            {/* ---------- LOGO UPLOAD ---------- */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Organisation Logo</label>

              <div className="flex items-center gap-4">
                {logoPreview && (
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    className="h-16 w-16 rounded border object-contain bg-white"
                  />
                )}

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    setLogoFile(file);
                    setLogoPreview(URL.createObjectURL(file));
                  }}
                  className="text-sm text-gray-400"
                />
              </div>
            </div>

            {/* ---------- COLOR PICKER ---------- */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400">
                Primary Theme Color
              </label>

              <div className="flex items-center gap-4">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="h-10 w-14 cursor-pointer rounded"
                />

                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^#([0-9A-Fa-f]{0,6})$/.test(val)) {
                      setPrimaryColor(val);
                    }
                  }}
                  maxLength={7}
                  className="input uppercase"
                  placeholder="#000000"
                />
              </div>
            </div>
          </div>

          <button
            className="btn w-full cursor-pointer"
            onClick={updateOrganisation}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Organisation"}
          </button>
        </>
      )}
    </div>
  );
}
