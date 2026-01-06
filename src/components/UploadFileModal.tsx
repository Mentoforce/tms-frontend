"use client";

import { useState } from "react";
import api from "@/lib/axios";

type FileItem = {
  file: File;
  name: string;
};

export default function UploadFileModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState<0 | 1>(0);
  const [ticketNumber, setTicketNumber] = useState("");
  const [username, setUsername] = useState("");
  const [ticketData, setTicketData] = useState<any>(null);

  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!open) return null;

  /* ================= STEP 1 ================= */

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

  /* ================= STEP 2 ================= */

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);

    if (selected.length + files.length > 4) {
      setError("Maximum 4 files allowed");
      return;
    }

    setFiles((prev) => [
      ...prev,
      ...selected.map((f) => ({ file: f, name: f.name })),
    ]);
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
      fd.append("ticket_number", ticketData.ticket.ticket_number); // ✅ FIX
      fd.append("username", username);

      files.forEach((f) => {
        fd.append("files", f.file, f.name);
      });

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
      console.log(ticketData.ticket.files);
      console.log(ticketData.ticket.ticket_number, username, fileId);
      await api.delete("/tickets/delete-file", {
        data: {
          ticket_number: ticketData.ticket.ticket_number,
          username,
          fileId,
        },
      });

      // update UI
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

  /* ================= UI ================= */

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-blue-950 w-full max-w-lg rounded-lg p-6">
        {/* HEADER */}
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold">Upload Files</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* SUCCESS */}
        {success ? (
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold">Files Uploaded 🎉</h3>
            <button className="btn" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <>
            {/* ERROR */}
            {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

            {/* STEP 1 */}
            {step === 0 && (
              <div className="space-y-3">
                <input
                  className="input"
                  placeholder="Ticket Number"
                  value={ticketNumber}
                  onChange={(e) => setTicketNumber(e.target.value)}
                />

                <input
                  className="input"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />

                <button
                  className="btn w-full"
                  onClick={verifyTicket}
                  disabled={loading}
                >
                  {loading ? "Verifying..." : "Verify Ticket"}
                </button>
              </div>
            )}

            {/* STEP 2 */}
            {step === 1 && (
              <div className="space-y-4">
                <p className="text-sm">
                  Ticket: <strong>{ticketData.ticket.ticket_number}</strong>
                </p>
                {ticketData.ticket.files.map((file: any) => (
                  <div
                    key={file._id}
                    className="flex justify-between items-center text-sm border p-2 rounded"
                  >
                    <a
                      href={file.file_url}
                      target="_blank"
                      className="text-blue-400 underline"
                    >
                      {file.file_name}
                    </a>

                    <button
                      className="btn-danger text-xs"
                      onClick={() => deleteExistingFile(file._id)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <input type="file" multiple onChange={handleFiles} />

                {/* FILE LIST */}
                <div className="space-y-2">
                  {files.map((f, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        className="input flex-1"
                        value={f.name}
                        onChange={(e) => updateFileName(i, e.target.value)}
                      />
                      <button
                        className="btn-danger"
                        onClick={() =>
                          setFiles(files.filter((_, idx) => idx !== i))
                        }
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  className="btn w-full"
                  onClick={uploadFiles}
                  disabled={loading}
                >
                  {loading ? "Uploading..." : "Upload Files"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
