"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { IconX, IconUpload } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { ThemeType } from "@/types/context-types";

type FileItem = {
  file: File;
  name: string;
  note: string; // 🔽 ADDED: note field
};

const DEFAULT_PRIMARY = "#DFD1A1";

export default function UploadFileModal({
  open,
  onClose,
  theme,
}: {
  open: boolean;
  onClose: () => void;
  theme?: ThemeType;
}) {
  // Extract theme colors with fallbacks
  const primarycolor = theme?.primary_color || DEFAULT_PRIMARY;
  const borderColor = theme?.border_color || primarycolor;
  const modalBgColor = theme?.modal_bg_color || "#0A0A0A";

  const [step, setStep] = useState<0 | 1>(0);
  const [ticketNumber, setTicketNumber] = useState("");
  const [username, setUsername] = useState("");
  const [ticketData, setTicketData] = useState<any>(null);

  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const usernameRegex = /^[a-zA-Z0-9]{4,}$/;
  const isUsernameValid = usernameRegex.test(username);

  if (!open) return null;

  /* ================= CLOSE HANDLER ================= */

  const handleClose = () => {
    setStep(0);
    setTicketNumber("");
    setUsername("");
    setTicketData(null);
    setFiles([]);
    setError(null);
    setSuccess(false);
    setLoading(false);
    onClose();
  };

  /* ================= HELPERS ================= */

  const isVerifyEnabled =
    ticketNumber !== "" && username !== "" && isUsernameValid;

  const addFiles = (incoming: File[]) => {
    setError(null);

    if (incoming.length + files.length > 4) {
      setError("Maximum 4 files allowed");
      return;
    }

    setFiles((prev) => [
      ...prev,
      ...incoming.map((f) => ({
        file: f,
        name: f.name,
        note: "", // 🔽 ADDED: default empty note
      })),
    ]);
  };

  /* ================= STEP 0 ================= */

  const verifyTicket = async () => {
    if (!ticketNumber || !username) {
      setError("Ticket number and username are required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await api.post("/tickets/search", {
        ticket_number: ticketNumber,
        username,
      });

      setTicketData(res.data.data);
      setStep(1);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError("Ticket does not exist");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  /* ================= STEP 1 ================= */

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    addFiles(selected);
  };

  const updateFileName = (i: number, name: string) => {
    setFiles((prev) => prev.map((f, idx) => (idx === i ? { ...f, name } : f)));
  };

  // 🔽 ADDED: Function to update note
  const updateFileNote = (i: number, note: string) => {
    setFiles((prev) => prev.map((f, idx) => (idx === i ? { ...f, note } : f)));
  };

  const uploadFiles = async () => {
    if (files.length === 0) {
      setError("Please select at least one file");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const fd = new FormData();
      fd.append("ticket_number", ticketData.ticket.ticket_number);
      fd.append("username", username);

      // 🔽 CHANGED: Append file_notes array
      files.forEach((f) => fd.append("file_notes[]", f.note || ""));

      files.forEach((f) => fd.append("files", f.file, f.name));

      await api.post("/tickets/upload-files", fd);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "File upload failed");
    } finally {
      setLoading(false);
    }
  };

  const deleteExistingFile = async (fileId: string) => {
    try {
      await api.delete("/tickets/delete-file", {
        data: {
          ticket_number: ticketData.ticket.ticket_number,
          username,
          fileId,
        },
      });

      setTicketData((prev: any) => ({
        ...prev,
        ticket: {
          ...prev.ticket,
          files: prev.ticket.files.filter((f: any) => f._id !== fileId),
        },
      }));
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete file");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4"
      style={{ color: primarycolor }}
    >
      <div
        className="w-full max-w-125 rounded-2xl"
        style={{
          backgroundColor: modalBgColor,
          border: `1px solid ${borderColor}`,
        }}
      >
        {/* HEADER */}
        <div className="px-5 sm:px-10 pt-6 sm:pt-8 pb-1">
          <div className="flex items-center justify-between">
            <h2 className="font-medium text-xl sm:text-2xl pt-3">
              File Upload
            </h2>
            <button
              onClick={handleClose}
              className="hover:opacity-70 text-xl sm:text-2xl pt-3 cursor-pointer"
              style={{ color: primarycolor }}
            >
              ✕
            </button>
          </div>

          <div
            className="mt-4 opacity-40"
            style={{ borderBottom: `1px solid ${borderColor}` }}
          />
        </div>

        <div className="px-6 sm:px-10 py-6 space-y-6 min-h-64">
          {success ? (
            <div className="flex flex-col items-center space-y-4">
              <motion.svg
                width="66"
                height="66"
                viewBox="0 0 52 52"
                initial="hidden"
                animate="visible"
              >
                <motion.circle
                  cx="26"
                  cy="26"
                  r="24"
                  fill="#22c55e"
                  variants={{
                    hidden: { scale: 0 },
                    visible: {
                      scale: 1,
                      transition: { duration: 0.45, ease: "easeOut" },
                    },
                  }}
                />
                <motion.path
                  d="M14 27 L22 35 L38 19"
                  fill="none"
                  stroke="#000"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  variants={{
                    hidden: { pathLength: 0, opacity: 0 },
                    visible: {
                      pathLength: 1,
                      opacity: 1,
                      transition: {
                        delay: 0.45,
                        duration: 0.35,
                        ease: "easeOut",
                      },
                    },
                  }}
                />
              </motion.svg>

              <p
                className="w-full mt-6 text-base text-left"
                style={{
                  color: primarycolor,
                  opacity: 0.7,
                }}
              >
                Files have been uploaded successfully.
              </p>

              <button
                onClick={handleClose}
                className="w-full py-3 rounded-lg text-sm font-bold cursor-pointer"
                style={{
                  backgroundColor: primarycolor,
                  color: modalBgColor,
                }}
              >
                Close
              </button>
            </div>
          ) : (
            <>
              {/* STEP 0 */}
              {step === 0 && (
                <div className="space-y-4">
                  <h3 className="text-md" style={{ color: primarycolor }}>
                    Verify your ticket
                  </h3>

                  <div>
                    <label className="block text-sm mb-2">Ticket Number</label>
                    <input
                      className="w-full mb-1 rounded-lg px-4 py-3 text-sm bg-transparent focus:outline-none"
                      style={{
                        border: `1px solid ${borderColor}`,
                        color: primarycolor,
                      }}
                      placeholder="Enter ticket number"
                      value={ticketNumber}
                      onChange={(e) => {
                        setTicketNumber(e.target.value);
                        setError(null);
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Username</label>
                    <input
                      className="w-full mb-1 rounded-lg px-4 py-3 text-sm bg-transparent focus:outline-none"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        setError(null);
                      }}
                      style={{
                        border: `1px solid ${borderColor}`,
                        color: primarycolor,
                      }}
                    />
                  </div>
                  {username && !isUsernameValid && (
                    <p className="text-xs text-red-400 mt-1">
                      Username must be at least 4 characters and contain no
                      special symbols
                    </p>
                  )}

                  {error && (
                    <p className="text-xs text-red-600 mt-1">{error}</p>
                  )}

                  <button
                    onClick={verifyTicket}
                    disabled={!isVerifyEnabled || loading}
                    className="cursor-pointer w-full py-3 rounded-lg text-sm font-bold transition disabled:opacity-40 disabled:cursor-not-allowed mb-5"
                    style={{
                      backgroundColor: primarycolor,
                      color: modalBgColor,
                    }}
                  >
                    {loading ? "Verifying..." : "Verify Ticket →"}
                  </button>
                </div>
              )}

              {/* STEP 1 */}
              {step === 1 && (
                <div className="space-y-5">
                  <p
                    className="text-sm"
                    style={{
                      color: primarycolor,
                      opacity: 0.6,
                    }}
                  >
                    Ticket ID:{" "}
                    <span className="font-mono">
                      {ticketData.ticket.ticket_number}
                    </span>
                  </p>

                  {ticketData.ticket.files.map((file: any) => (
                    <div
                      key={file._id}
                      className="flex items-center justify-between px-3 py-2 rounded-lg gap-6"
                      style={{
                        border: `1px solid ${borderColor}`,
                        color: primarycolor,
                      }}
                    >
                      <a
                        href={file.file_url}
                        target="_blank"
                        className="text-sm underline truncate"
                        style={{ color: primarycolor }}
                      >
                        {file.file_name}
                      </a>

                      <button
                        onClick={() => deleteExistingFile(file._id)}
                        className="text-red-600 hover:text-red-400"
                      >
                        <IconX size={16} />
                      </button>
                    </div>
                  ))}

                  <div className="flex items-center justify-between text-sm">
                    <span
                      className="font-medium"
                      style={{ color: primarycolor }}
                    >
                      Files:
                    </span>
                    <span
                      style={{
                        color: primarycolor,
                        opacity: 0.5,
                      }}
                    >
                      {(ticketData?.ticket?.files?.length || 0) + files.length}
                      /4 files uploaded
                    </span>
                  </div>

                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      addFiles(Array.from(e.dataTransfer.files));
                    }}
                    className="rounded-xl border border-dashed text-center py-10"
                    style={{
                      borderColor: `${primarycolor}AA`,
                    }}
                  >
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      id="upload-files"
                      onChange={handleFiles}
                    />
                    <label
                      htmlFor="upload-files"
                      className="cursor-pointer flex flex-col items-center gap-2"
                      style={{
                        color: primarycolor,
                      }}
                    >
                      <div className="text-xl">
                        <IconUpload size={18} stroke={2} />
                      </div>
                      <p className="text-sm">
                        Drag & drop files here or{" "}
                        <span className="underline">browse</span>
                      </p>
                      <p
                        className="text-xs"
                        style={{
                          color: primarycolor,
                          opacity: 0.4,
                        }}
                      >
                        (PDF/Photo: 10MB • Video: 50MB)
                      </p>
                    </label>
                  </div>

                  {files.length > 0 && (
                    <div className="space-y-3">
                      {files.map((f, i) => (
                        <div
                          key={i}
                          className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-lg px-3 py-3"
                          style={{
                            border: `1px solid ${borderColor}`,
                          }}
                        >
                          <div className="flex-1">
                            <div
                              className="text-sm"
                              style={{ color: primarycolor }}
                            >
                              {f.name.slice(0, 15)}
                              {f.name.length > 15 ? "..." : ""}
                            </div>
                            <div
                              className="text-xs"
                              style={{ color: theme?.sub_color }}
                            >
                              {(f.file.size / (1024 * 1024)).toFixed(2)} MB
                            </div>
                          </div>
                          <div className="flex gap-4 items-center">
                            <input
                              value={f.note}
                              onChange={(e) =>
                                updateFileNote(i, e.target.value)
                              }
                              placeholder="Note (optional, max 15 chars)"
                              maxLength={15}
                              className="rounded px-3 py-1.5 text-xs bg-transparent focus:outline-none"
                              style={{
                                border: `1px solid ${borderColor}`,
                                color: theme?.sub_color || primarycolor,
                                opacity: 0.7,
                              }}
                            />
                            <button
                              onClick={() =>
                                setFiles(files.filter((_, idx) => idx !== i))
                              }
                              className="text-red-600 text-xs hover:text-red-400 cursor-pointer whitespace-nowrap"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {error && (
                    <p className="text-xs text-red-400 mt-1">{error}</p>
                  )}

                  <button
                    onClick={uploadFiles}
                    disabled={loading || files.length === 0}
                    className="cursor-pointer w-full py-3 rounded-lg text-sm font-bold transition disabled:opacity-40 disabled:cursor-not-allowed mb-5"
                    style={{
                      backgroundColor: primarycolor,
                      color: modalBgColor,
                    }}
                  >
                    {loading ? "Uploading..." : "Upload Files →"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
