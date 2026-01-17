"use client";

import { useState } from "react";
import api from "@/lib/axios";
import FooterPreview from "./FooterPreview";
import { FOOTER_TEMPLATES } from "../../../lib/FooterTemplates";
import { X } from "lucide-react";

type FooterItem = {
  _id?: string;
  title: string;
  html_content: string;
  is_active: boolean;
  social_links: [{ label: string; url: string; icon?: string }];
};

export default function FooterModal({
  initialData,
  onClose,
  onSaved,
}: {
  initialData: Partial<FooterItem>;
  onClose: () => void;
  onSaved: (saved: FooterItem) => void;
}) {
  const [title, setTitle] = useState(initialData.title || "");
  const [html, setHtml] = useState(initialData.html_content || "");
  const [active, setActive] = useState(initialData.is_active ?? true);
  const [loading, setLoading] = useState(false);

  const [showPreview, setShowPreview] = useState(false);
  const [socialLinks, setSocialLinks] = useState(
    initialData.social_links || []
  );

  const save = async () => {
    setLoading(true);

    const payload: any = {
      title,
      html_content: html,
      is_active: active,
    };

    //send _id ONLY when editing
    if (initialData._id) {
      payload._id = initialData._id;
    }

    const res = await api.post("/admin/footer", payload);

    onSaved(res.data.data);
    onClose();
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-lg rounded-xl bg-[#0B0F1A] border border-white/10 p-6">
        <div className="flex justify-between mb-10">
          <h2>{initialData ? "Update" : "Create"} Footer</h2>
          <X onClick={onClose} />
        </div>
        <label>Title</label>
        <input
          className="input mb-3 w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Content title"
        />
        <label>Content</label>
        <textarea
          rows={8}
          className="input w-full mb-3"
          value={html}
          onChange={(e) => setHtml(e.target.value)}
          placeholder="Footer HTML content"
        />
        <div className="flex gap-2 mb-3">
          <button
            className="btn-secondary text-xs"
            onClick={() => setHtml(FOOTER_TEMPLATES.copyright)}
          >
            Insert Copyright
          </button>

          <button
            className="btn-secondary text-xs"
            onClick={() => setHtml(FOOTER_TEMPLATES.list)}
          >
            Insert List
          </button>

          <button
            className="btn-secondary text-xs"
            onClick={() => setHtml(FOOTER_TEMPLATES.links)}
          >
            Insert Links
          </button>

          <button
            className="btn-secondary text-xs"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? "Hide Preview" : "Preview"}
          </button>
        </div>
        {showPreview && <FooterPreview html={html} socials={[]} />}

        <label className="flex items-center gap-2 text-sm mb-4">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
          />
          Active
        </label>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="border p-2 rounded-sm">
            Cancel
          </button>
          <button onClick={save} disabled={loading} className="btn">
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
