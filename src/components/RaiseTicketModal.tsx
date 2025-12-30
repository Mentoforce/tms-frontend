"use client";

import { useEffect, useRef, useState } from "react";
import api from "@/lib/axios";

type Subject = {
  _id: string;
  title: string;
  sub_subjects: {
    _id: string;
    title: string;
    predefined_text: string;
  }[];
};

export default function RaiseTicketModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  const [step, setStep] = useState(0);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subSubjects, setSubSubjects] = useState<any[]>([]);
  const [successTicket, setSuccessTicket] = useState<string | null>(null);
  const [counter, setCounter] = useState(5);

  const [draft, setDraft] = useState<any>({
    username: "",
    subject_id: "",
    sub_subject_id: "",
    description: "",
    audio: null,
    files: [],
    return_channel: "email",
  });

  /* ---------------- Fetch Subjects ---------------- */
  useEffect(() => {
    api.get("/subjects").then((res) => setSubjects(res.data.data));
  }, []);

  /* ---------------- Step 2 Timer ---------------- */
  useEffect(() => {
    if (step === 1 && counter > 0) {
      const t = setTimeout(() => setCounter((c) => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [step, counter]);

  /* ---------------- Audio ---------------- */
  const mediaRecorder = useRef<MediaRecorder | null>(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    const chunks: BlobPart[] = [];

    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = () =>
      setDraft({ ...draft, audio: new Blob(chunks, { type: "audio/webm" }) });

    recorder.start();
    mediaRecorder.current = recorder;
  };

  const stopRecording = () => mediaRecorder.current?.stop();

  /* ---------------- Submit ---------------- */
  const submitTicket = async () => {
    const fd = new FormData();

    Object.entries(draft).forEach(([k, v]: any) => {
      if (k === "files" || k === "audio") return;
      fd.append(k, v);
    });

    if (draft.audio) fd.append("audio", draft.audio);

    draft.files.forEach((f: any) => fd.append("files", f.file, f.name));
    console.log(draft);
    console.log(fd);
    const res = await api.post("/tickets/create", fd);
    setSuccessTicket(res.data.data.ticket_number);
  };

  /* ================================================= */

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-blue-900 w-full max-w-3xl rounded-lg shadow-lg p-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Raise a Ticket</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* SUCCESS */}
        {successTicket ? (
          <SuccessScreen
            ticket={successTicket}
            onClose={onClose}
            onReset={() => {
              setSuccessTicket(null);
              setStep(0);
            }}
          />
        ) : (
          <>
            {/* BODY */}
            <div className="min-h-75">
              {step === 0 && (
                <>
                  <input
                    placeholder="Username"
                    className="input"
                    value={draft.username}
                    onChange={(e) =>
                      setDraft({ ...draft, username: e.target.value })
                    }
                  />

                  <select
                    className="input mt-3"
                    onChange={(e) => {
                      const subject = subjects.find(
                        (s) => s._id === e.target.value
                      );
                      setSubSubjects(subject?.sub_subjects || []);
                      setDraft({
                        ...draft,
                        subject_id: e.target.value,
                        sub_subject_id: "",
                      });
                    }}
                  >
                    <option value="">Select Subject</option>
                    {subjects.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.title}
                      </option>
                    ))}
                  </select>

                  <select
                    className="input mt-3"
                    disabled={!draft.subject_id}
                    onChange={(e) => {
                      const ss = subSubjects.find(
                        (x) => x._id === e.target.value
                      );
                      setDraft({
                        ...draft,
                        sub_subject_id: e.target.value,
                        description: ss?.predefined_text || "",
                      });
                    }}
                  >
                    <option value="">Select Sub Subject</option>
                    {subSubjects.map((ss) => (
                      <option key={ss._id} value={ss._id}>
                        {ss.title}
                      </option>
                    ))}
                  </select>
                </>
              )}

              {step === 1 && (
                <>
                  <p className="text-sm text-gray-600">
                    Please read this important note carefully.
                  </p>
                  <button
                    disabled={counter > 0}
                    className="btn mt-4"
                    onClick={() => setStep(2)}
                  >
                    Continue {counter > 0 && `(${counter})`}
                  </button>
                </>
              )}

              {step === 2 && (
                <>
                  <textarea
                    className="input h-32"
                    value={draft.description}
                    onChange={(e) =>
                      setDraft({ ...draft, description: e.target.value })
                    }
                  />
                  <div className="mt-3 space-x-2">
                    <button className="btn" onClick={startRecording}>
                      Record
                    </button>
                    <button className="btn-danger" onClick={stopRecording}>
                      Stop
                    </button>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <input
                    type="file"
                    multiple
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        files: Array.from(e.target.files || []).map((f) => ({
                          file: f,
                          name: f.name,
                        })),
                      })
                    }
                  />
                </>
              )}

              {step === 4 && (
                <div className="space-y-2">
                  {["whatsapp", "telegram", "telephone", "email"].map((c) => (
                    <label key={c} className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={draft.return_channel === c}
                        onChange={() =>
                          setDraft({ ...draft, return_channel: c })
                        }
                      />
                      {c}
                    </label>
                  ))}
                </div>
              )}

              {step === 5 && (
                <div className="text-sm space-y-2">
                  <p>User: {draft.username}</p>
                  <p>Channel: {draft.return_channel}</p>
                  <p>Files: {draft.files.length}</p>
                </div>
              )}
            </div>

            {/* FOOTER */}
            <div className="flex justify-between mt-6">
              <button
                disabled={step === 0}
                onClick={() => setStep(step - 1)}
                className="btn-outline"
              >
                Back
              </button>

              {step < 5 ? (
                <button className="btn" onClick={() => setStep(step + 1)}>
                  Next
                </button>
              ) : (
                <button className="btn" onClick={submitTicket}>
                  Submit
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ================= SUCCESS ================= */

function SuccessScreen({
  ticket,
  onClose,
  onReset,
}: {
  ticket: string;
  onClose: () => void;
  onReset: () => void;
}) {
  return (
    <div className="text-center space-y-4">
      <h3 className="text-lg font-semibold">Ticket Created 🎉</h3>
      <div className="border rounded p-3 font-mono">{ticket}</div>

      <div className="flex justify-center gap-3">
        <button className="btn-outline" onClick={onReset}>
          Raise Another
        </button>
        <button className="btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
