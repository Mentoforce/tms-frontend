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

export default function FooterTable({
  data,
  onRefresh,
}: {
  data: FooterItem[];
  onRefresh: () => void;
}) {
  const [editing, setEditing] = useState<FooterItem | null>(null);
  const toggleActive = async (f: FooterItem) => {
    await api.post("/admin/footer", {
      _id: f._id,
      is_active: !f.is_active,
    });
    onRefresh();
  };

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
              onRefresh();
            }}
          />
        )}

        <table className="w-full text-sm">
          <thead className="bg-white/5">
            <tr>
              <Th>TITLE</Th>
              <Th>STATUS</Th>
              <Th>UPDATED</Th>
              <Th>ACTIONS</Th>
            </tr>
          </thead>

          <tbody>
            {data?.map((f) => (
              <tr key={f._id} className="border-t border-white/5 text-center">
                <Td>{f.title}</Td>
                <Td>
                  <button
                    onClick={() => {
                      toggleActive(f);
                    }}
                    className="cursor-pointer"
                  >
                    <ActivePill status={f.is_active} />
                  </button>
                </Td>
                <Td>
                  {f.updatedAt ? new Date(f.updatedAt).toLocaleString() : "-"}
                </Td>
                <Td>
                  <div className="flex gap-2 justify-center">
                    <Pen
                      size={14}
                      className="cursor-pointer"
                      onClick={() => setEditing(f)}
                    />
                    <Trash
                      size={14}
                      className="hover:text-red-400 cursor-pointer"
                      onClick={async () => {
                        await api.post("/admin/footer/delete", {
                          footer_id: f._id,
                        });
                        onRefresh();
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
