"use client";

import { Component, X } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import {
  IconBrandTelegram,
  IconBrandWhatsapp,
  IconGift,
  IconMail,
  IconPhoneCall,
  IconTicket,
  IconUpload,
  IconUser,
  IconWorldWww,
} from "@tabler/icons-react";

const ICON_MAP: any = [
  { name: "IconTicket", component: IconTicket },
  { name: "IconPhoneCall", component: IconPhoneCall },
  { name: "IconBrandWhatsapp", component: IconBrandWhatsapp },
  { name: "IconBrandTelegram", component: IconBrandTelegram },
  { name: "IconMail", component: IconMail },
  { name: "IconUpload", component: IconUpload },
  { name: "IconGift", component: IconGift },
  { name: "IconWorldWww", component: IconWorldWww },
  { name: "IconUser", Component: IconUser },
];

export default function CreateButtonModal({
  initialData,
  onClose,
  onSaved,
}: {
  initialData?: any;
  onClose: () => void;
  onSaved: (config: any) => void;
}) {
  const [form, setForm] = useState({
    _id: "",
    title: "",
    subtitle: "",
    icon: "",
    action_type: "",
    action_target: "",
    is_active: true,
    quick_access: false,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        _id: initialData._id || "",
        title: initialData.title || "",
        subtitle: initialData.subtitle || "",
        icon: initialData.icon || "",
        action_type: initialData.action.type || "",
        action_target: initialData.action.target || "",
        is_active: initialData.is_active ?? true,
        quick_access: initialData.quick_access ?? false,
      });
    }
  }, [initialData]);

  const submit = async () => {
    setLoading(true);
    try {
      const payload = {
        ...form,
        button_id: form._id || undefined,
      };

      const res = await api.post("/create-button", payload);
      onSaved(res.data.data);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-lg rounded-xl bg-[#0B0F1A] border border-white/10">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-white/10">
          <h2 className="text-lg font-semibold">
            {form._id ? "Update Buttons " : "Create Buttons"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-sm">
          <label>Title</label>
          <input
            className="input w-full"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <label>Subtitle</label>
          <input
            className="input w-full"
            placeholder="subtitle"
            value={form.subtitle}
            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
          />
          <label>Icon</label>
          <select
            className="border rounded w-full px-2 py-2 bg-[#000d1a]"
            value={form.icon}
            onChange={(e) => setForm({ ...form, icon: e.target.value })}
          >
            {ICON_MAP.map((opt: any, idx: number) => (
              <option key={idx} value={opt.name}>
                {opt.name}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-white">Preview:</span>
            {(() => {
              const found = ICON_MAP.find((i: any) => i.name === form.icon);
              if (!found) return null;
              const IconComp = found.component;
              return <IconComp className="w-6 h-6 text-white" />;
            })()}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>Action Type</label>
              <select
                value={form.action_type}
                onChange={(e) =>
                  setForm({ ...form, action_type: e.target.value })
                }
                className="select-clean mb-1 w-full rounded-lg px-4 py-4 pr-12 text-sm bg-transparent text-white focus:outline-none"
                style={{ border: "1px solid rgba(255,255,255,0.4)" }}
              >
                <option value="">Choose a main topic</option>
                <option value="modal" disabled>
                  Modal
                </option>
                <option value="redirect">Redirect</option>
              </select>
            </div>
            <div>
              <label>Action Target</label>
              <input
                type="input"
                className="input w-full"
                value={form.action_target}
                onChange={(e) =>
                  setForm({ ...form, action_target: e.target.value })
                }
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) =>
                setForm({ ...form, is_active: e.target.checked })
              }
            />
            Active
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.quick_access}
              onChange={(e) =>
                setForm({ ...form, quick_access: e.target.checked })
              }
            />
            Quick Access
          </label>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10">
          <button onClick={submit} disabled={loading} className="btn w-full">
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
