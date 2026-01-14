"use client";

import { Pen, Trash } from "lucide-react";
import { useState } from "react";
import api from "@/lib/axios";
import Td from "@/components/admin/tables/util/Td";
import Th from "@/components/admin/tables/util/Th";
import ActivePill from "@/components/ActivePill";
import FooterModal from "../footer/FooterModal";

type FooterItem = {
  _id?: string;
  title: string;
  html_content: string;
  is_active: boolean;
  updatedAt?: string;
};

export default function FooterTable({ data }: { data: FooterItem[] }) {
  const [items, setItems] = useState<FooterItem[]>(data);
  const [editing, setEditing] = useState<FooterItem | null>(null);

  return (
    <>
      <button
        onClick={() =>
          setEditing({
            title: "",
            html_content: "",
            is_active: true,
          } as FooterItem)
        }
        className="btn mb-8 w-full"
      >
        + Add New Content
      </button>

      <div className="rounded-xl border border-white/10 overflow-hidden">
        {editing && (
          <FooterModal
            initialData={editing}
            onClose={() => setEditing(null)}
            onSaved={(saved: FooterItem) => {
              setItems((prev) => {
                const exists = prev.find((i) => i._id === saved._id);
                return exists
                  ? prev.map((i) => (i._id === saved._id ? saved : i))
                  : [saved, ...prev];
              });
            }}
          />
        )}

        <table className="w-full text-sm">
          <thead className="bg-white/5">
            <tr>
              <Th>Title</Th>
              <Th>Status</Th>
              <Th>Updated</Th>
              <Th>Actions</Th>
            </tr>
          </thead>

          <tbody>
            {items.map((f) => (
              <tr key={f._id} className="border-t border-white/5">
                <Td>{f.title}</Td>
                <Td>
                  <ActivePill status={f.is_active} />
                </Td>
                <Td>
                  {f.updatedAt ? new Date(f.updatedAt).toLocaleString() : "-"}
                </Td>
                <Td>
                  <div className="flex gap-2">
                    <Pen
                      className="cursor-pointer"
                      onClick={() => setEditing(f)}
                    />
                    <Trash
                      className="cursor-pointer"
                      onClick={async () => {
                        await api.post("/admin/footer/delete", {
                          footer_id: f._id,
                        });
                        setItems(items.filter((i) => i._id !== f._id));
                      }}
                    />
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
