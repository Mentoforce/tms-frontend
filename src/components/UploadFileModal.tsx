"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { IconX, IconUpload } from "@tabler/icons-react";
import { motion } from "framer-motion";

type FileItem = {
  file: File;
  name: string;
};

const DEFAULT_PRIMARY = "#DFD1A1";

export default function UploadFileModal({
  open,
  onClose,
  primarycolor,
}: {
  open: boolean;
  onClose: () => void;
  primarycolor?: string;
}) {
  const accent = primarycolor || DEFAULT_PRIMARY;

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
      ...incoming.map((f) => ({ file: f, name: f.name })),
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
      style={{ ["--accent" as any]: accent }}
    >
      <div
        className="w-full max-w-125 rounded-2xl bg-[#0A0A0A]"
        style={{ border: "1px solid var(--accent)" }}
      >
        {/* HEADER */}
        <div className="px-6 sm:px-10 pt-7 pb-2">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-medium text-2xl pt-2">
              File Upload
            </h2>
            <button
              onClick={handleClose}
              className="text-white/80 hover:text-white text-2xl cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div
            className="mt-4"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.3)" }}
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

              <p className="w-full mt-6 text-base text-white/70 text-left">
                Files have been uploaded successfully.
              </p>

              <button
                onClick={handleClose}
                className="w-full py-3 rounded-lg text-sm font-bold text-black cursor-pointer"
                style={{ backgroundColor: "var(--accent)" }}
              >
                Close
              </button>
            </div>
          ) : (
            <>
              {/* STEP 0 */}
              {step === 0 && (
                <div className="space-y-4">
                  <h3 className="text-md" style={{ color: "var(--accent)" }}>
                    Verify your ticket
                  </h3>

                  <div>
                    <label className="block text-sm text-white mb-2">
                      Ticket Number
                    </label>
                    <input
                      className="w-full mb-1 rounded-lg px-4 py-3 text-sm bg-transparent text-white focus:outline-none"
                      style={{ border: "1px solid rgba(255,255,255,0.35)" }}
                      placeholder="Enter ticket number"
                      value={ticketNumber}
                      onChange={(e) => {
                        setTicketNumber(e.target.value);
                        setError(null);
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-white mb-2">
                      Username
                    </label>
                    <input
                      className="w-full mb-1 rounded-lg px-4 py-3 text-sm bg-transparent text-white focus:outline-none"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        setError(null);
                      }}
                      style={{
                        border: `1px solid ${
                          username && !isUsernameValid
                            ? "red"
                            : "rgba(255,255,255,0.4)"
                        }`,
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
                    <p className="text-xs text-red-400 mt-1">{error}</p>
                  )}

                  <button
                    onClick={verifyTicket}
                    disabled={!isVerifyEnabled || loading}
                    className="cursor-pointer w-full py-3 rounded-lg text-sm font-bold text-black mb-5 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ backgroundColor: "var(--accent)" }}
                  >
                    {loading ? "Verifying..." : "Verify Ticket →"}
                  </button>
                </div>
              )}

              {/* STEP 1 */}
              {step === 1 && (
                <div className="space-y-5">
                  <p className="text-sm text-white/60">
                    Ticket ID:{" "}
                    <span className="text-white font-mono">
                      {ticketData.ticket.ticket_number}
                    </span>
                  </p>

                  {ticketData.ticket.files.map((file: any) => (
                    <div
                      key={file._id}
                      className="flex items-center justify-between px-3 py-2 rounded-lg"
                      style={{ border: "1px solid rgba(255,255,255,0.3)" }}
                    >
                      <a
                        href={file.file_url}
                        target="_blank"
                        className="text-sm text-white underline"
                      >
                        {file.file_name}
                      </a>

                      <button
                        onClick={() => deleteExistingFile(file._id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <IconX size={16} />
                      </button>
                    </div>
                  ))}

                  {/* ✅ ONLY LOGIC CHANGE IS HERE */}
                  <div className="flex items-center justify-between text-sm">
                    <span
                      className="font-medium"
                      style={{ color: "var(--accent)" }}
                    >
                      Files:
                    </span>
                    <span className="text-white/50">
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
                    style={{ borderColor: "rgba(255,255,255,0.4)" }}
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
                      className="cursor-pointer flex flex-col items-center gap-2 text-white/70"
                    >
                      <div className="text-xl">
                        <IconUpload size={18} stroke={2} />
                      </div>
                      <p className="text-sm">
                        Drag & drop files here or{" "}
                        <span className="underline">browse</span>
                      </p>
                      <p className="text-xs text-white/40">
                        (PDF/Photo: 10MB • Video: 50MB)
                      </p>
                    </label>
                  </div>

                  {files.length > 0 && (
                    <div className="space-y-2">
                      {files.map((f, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 rounded-lg px-3 py-2"
                          style={{ border: "1px solid var(--accent)" }}
                        >
                          <input
                            value={f.name}
                            onChange={(e) => updateFileName(i, e.target.value)}
                            className="flex-1 bg-transparent text-white text-sm focus:outline-none"
                          />
                          <button
                            onClick={() =>
                              setFiles(files.filter((_, idx) => idx !== i))
                            }
                            className="text-red-400 text-xs hover:text-red-300 cursor-pointer"
                          >
                            Remove
                          </button>
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
                    className="cursor-pointer w-full py-3 rounded-lg text-sm font-bold text-black transition disabled:opacity-40 disabled:cursor-not-allowed mb-5"
                    style={{ backgroundColor: "var(--accent)" }}
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
