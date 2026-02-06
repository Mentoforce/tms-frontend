"use client";

import { useOrganisation } from "@/context/OrganisationProvider";
import api from "@/lib/axios";
import { useEffect, useState } from "react";

type ThemeState = {
  primary_color: string;
  base_color: string;
  bg_color: string;
  sub_color: string;
  border_color: string;
  modal_bg_color: string;
};

export default function OrganisationPage() {
  const { organisation } = useOrganisation();

  const [loading, setLoading] = useState(false);
  const [org, setOrg] = useState<any>(null);

  const [link, setLink] = useState("/");
  const [theme, setTheme] = useState<ThemeState>({
    primary_color: "#000000",
    base_color: "#000000",
    bg_color: "#ffffff",
    sub_color: "#f5f5f5",
    border_color: "#e5e7eb",
    modal_bg_color: "#e5e7eb",
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  /* ---------------- LOAD ORG ---------------- */
  const checkOrganisation = async () => {
    if (!organisation) return;

    setLoading(true);
    try {
      const res = await api.post("/check-org", {
        code: organisation.code,
      });

      const data = res.data.data;
      setOrg(data);
      setLink(data?.link || "/");

      setTheme({
        primary_color: data?.theme?.primary_color || "#000000",
        base_color: data?.theme?.base_color || "#000000",
        bg_color: data?.theme?.bg_color || "#ffffff",
        sub_color: data?.theme?.sub_color || "#f5f5f5",
        border_color: data?.theme?.border_color || "#e5e7eb",
        modal_bg_color: data?.theme?.modal_bg_color || "#e5e7eb",
      });

      setLogoPreview(data?.logo || null);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UPDATE ORG ---------------- */
  const updateOrganisation = async () => {
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("link", link);
      formData.append("theme", JSON.stringify(theme));

      if (logoFile) {
        formData.append("logo", logoFile);
      }
      await api.post("/update-org", formData);
      await checkOrganisation();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkOrganisation();
  }, []);

  /* ---------------- UI ---------------- */
  return (
    <div className="w-full space-y-6 overflow-x-hidden">
      <h1 className="text-xl font-semibold">Organisation Settings</h1>

      {org && (
        <>
          <div className="rounded-lg border border-white/10 p-4 space-y-8">
            {/* ---------- ORG INFO ---------- */}
            <p className="text-sm text-gray-400">
              Organisation:
              <span className="ml-1 text-white font-medium">{org.name}</span>
            </p>

            {/* ---------- LOGO ---------- */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Organisation Logo</label>

              <div className="flex items-center gap-4">
                {logoPreview && (
                  <img
                    src={logoPreview}
                    alt="Logo"
                    className="h-16 w-16 rounded border bg-white object-contain"
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

            {/* ---------- THEME COLORS ---------- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(theme).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <label className="text-sm text-gray-400 capitalize">
                    {key.replace("_", " ")}
                  </label>

                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      value={value}
                      onChange={(e) =>
                        setTheme((prev) => ({
                          ...prev,
                          [key]: e.target.value,
                        }))
                      }
                      className="h-10 w-14 cursor-pointer rounded"
                    />

                    <input
                      type="text"
                      value={value}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/^#([0-9A-Fa-f]{0,6})$/.test(val)) {
                          setTheme((prev) => ({
                            ...prev,
                            [key]: val,
                          }));
                        }
                      }}
                      maxLength={7}
                      className="input uppercase"
                      placeholder="#000000"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* ---------- LINK ---------- */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Website Link</label>
              <input
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="h-10 w-full rounded border border-white/10 bg-transparent px-3"
              />
            </div>
          </div>

          <button
            className="btn w-full"
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
