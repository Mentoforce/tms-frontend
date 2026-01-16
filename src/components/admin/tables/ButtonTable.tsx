"use client";

import { Pen, Trash } from "lucide-react";
import { useState } from "react";
import Td from "./util/Td";
import Th from "./util/Th";
import api from "@/lib/axios";
import ActivePill from "@/components/ActivePill";
import CreateButtonModal from "./CreateButtonModal";

type ButtonConfig = {
  _id: string;
  title: string;
  subtitle: string;
  icon: string;
  action: {
    type: string;
    target: string;
  };
  is_active: boolean;
  quick_access: boolean;
};

export default function ButtonTable({ config }: { config: ButtonConfig[] }) {
  const [openModal, setOpenModal] = useState(false);
  const [editingConfig, setEditingConfig] = useState<any>(null);
  const [configData, setConfigData] = useState(config || []);

  if (!config || config.length === 0) {
    return (
      <>
        <button
          onClick={() => {
            setEditingConfig(null);
            setOpenModal(true);
          }}
          className="btn cursor-pointer mb-10 w-full"
        >
          + Create Button
        </button>
        {openModal && (
          <CreateButtonModal
            initialData={editingConfig}
            onClose={() => {
              setOpenModal(false);
              setEditingConfig(null);
            }}
            onSaved={(saved) => {
              setConfigData((prev) => {
                const exists = prev.find((c) => c._id === saved._id);
                return exists
                  ? prev.map((c) => (c._id === saved._id ? saved : c))
                  : [saved, ...prev];
              });
            }}
          />
        )}
        <div className="rounded-xl border border-white/10 p-8 text-center text-gray-400">
          No Buttons found
        </div>
      </>
    );
  }

  const updateActiveStatus = async (config: ButtonConfig) => {
    await api.post("/create-button", {
      is_active: !config.is_active,
      button_id: config._id,
    });
    setConfigData((prev) =>
      prev.map((c) =>
        c._id === config._id ? { ...c, is_active: !c.is_active } : c
      )
    );
  };

  const deletButton = async (id: string) => {
    await api.post("/delete-button", {
      button_id: id,
    });
  };
  return (
    <>
      <button
        onClick={() => {
          setEditingConfig(null);
          setOpenModal(true);
        }}
        className="btn cursor-pointer mb-10 w-full"
      >
        + Create Button
      </button>
      <div className="rounded-xl border border-white/10 overflow-hidden">
        {openModal && (
          <CreateButtonModal
            initialData={editingConfig}
            onClose={() => {
              setOpenModal(false);
              setEditingConfig(null);
            }}
            onSaved={(saved) => {
              setConfigData((prev) => {
                const exists = prev.find((c) => c._id === saved._id);
                return exists
                  ? prev.map((c) => (c._id === saved._id ? saved : c))
                  : [saved, ...prev];
              });
            }}
          />
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-sm overflow-x-auto">
            <thead className="bg-white/5">
              <tr>
                <Th>BUTTON</Th>
                <Th>ACTION</Th>
                <Th>PART</Th>
                <Th>STATUS</Th>
                <Th>UPDATE</Th>
              </tr>
            </thead>

            <tbody>
              {configData.map((b) => (
                <tr
                  key={b._id}
                  className="border-t border-white/5 hover:bg-white/5 transition"
                >
                  <Td className="text-gray-400">
                    <div className="text-white text-md">{b.title}</div>
                    <div className="text-xs hidden md:block"> {b.subtitle}</div>
                  </Td>
                  <Td className="text-gray-400">
                    <div className="text-white text-md">{b.action.type}</div>
                    <div className="text-xs"> {b.action.target}</div>
                  </Td>
                  <Td className="text-gray-400">
                    {b.quick_access ? "Quick Access" : "Quick Support"}
                  </Td>

                  <Td>
                    <button
                      className="cursor-pointer"
                      onClick={() => {
                        updateActiveStatus(b);
                      }}
                    >
                      <ActivePill status={b.is_active} />
                    </button>
                  </Td>

                  <Td>
                    <div className="flex gap-2 justify-around">
                      <button
                        onClick={() => {
                          setEditingConfig(b);
                          setOpenModal(true);
                        }}
                        className="text-gray-400 hover:text-white cursor-pointer"
                      >
                        <Pen size={16} />
                      </button>
                      <button
                        onClick={() => {
                          deletButton(b._id);
                          setConfigData(
                            configData.filter((config) => config._id !== b._id)
                          );
                        }}
                        className="text-gray-400 hover:text-white cursor-pointer"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
