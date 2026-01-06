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

const TOTAL_STEPS = 6;
const DEFAULT_PRIMARY = "#AD9E70";

export default function RaiseTicketModal({
  open,
  onClose,
  primarycolor,
}: {
  open: boolean;
  onClose: () => void;
  primarycolor?: string;
}) {
  const accent = primarycolor || DEFAULT_PRIMARY;

  const [step, setStep] = useState(0);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subSubjects, setSubSubjects] = useState<any[]>([]);
  const [successTicket, setSuccessTicket] = useState<string | null>(null);
  const [counter, setCounter] = useState(5);

  const [draft, setDraft] = useState({
    username: "",
    subject_id: "",
    sub_subject_id: "",
    description: "",
    audio: null as Blob | null,
    files: [] as { file: File; name: string }[],
    return_channel: "email",
  });

  /* ---------------- Fetch Subjects ---------------- */
  useEffect(() => {
    api.get("/subjects").then((res) => setSubjects(res.data.data));
  }, []);

  /* ---------------- Step 1 Timer ---------------- */
  useEffect(() => {
    if (step === 1 && counter > 0) {
      const t = setTimeout(() => setCounter((c) => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [step, counter]);

  /* ---------------- Audio Recording ---------------- */
  const mediaRecorder = useRef<MediaRecorder | null>(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    const chunks: BlobPart[] = [];

    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = () =>
      setDraft((d) => ({
        ...d,
        audio: new Blob(chunks, { type: "audio/webm" }),
      }));

    recorder.start();
    mediaRecorder.current = recorder;
  };

  const stopRecording = () => mediaRecorder.current?.stop();

  /* ---------------- Submit ---------------- */
  const submitTicket = async () => {
    const fd = new FormData();

    fd.append("username", draft.username);
    fd.append("subject_id", draft.subject_id);
    fd.append("sub_subject_id", draft.sub_subject_id);
    fd.append("description", draft.description);
    fd.append("return_channel", draft.return_channel);

    if (draft.audio) fd.append("audio", draft.audio);

    draft.files.forEach((f) => {
      fd.append("files", f.file, f.name);
    });

    const res = await api.post("/tickets/create", fd);
    setSuccessTicket(res.data.data.ticket_number);
  };

  if (!open) return null;

  /* ---------------- Validation ---------------- */
  const canMoveForward =
    draft.username.trim() !== "" &&
    draft.subject_id !== "" &&
    draft.sub_subject_id !== "";

  const usernameRegex = /^[a-zA-Z0-9]{4,}$/;
  const isUsernameValid = usernameRegex.test(draft.username);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4"
      style={{ ["--accent" as any]: accent }}
    >
      <div
        className="w-full max-w-125 rounded-2xl bg-[#0A0A0A] shadow-[0_0_60px_rgba(0,0,0,0.9)]"
        style={{ border: "1px solid var(--accent)" }}
      >
        {/* HEADER */}
        <div className="px-10 pt-8 pb-2">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-medium text-2xl pt-3">
              Request for Quick Support
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-white/70 text-2xl pt-3"
            >
              ✕
            </button>
          </div>

          {/* INSET DIVIDER */}
          <div
            className="mt-5"
            style={{
              borderBottom: "1px solid rgba(255,255,255,0.3)",
              marginLeft: "4px",
              marginRight: "4px",
            }}
          />
        </div>

        {successTicket ? (
          <SuccessScreen ticket={successTicket} onClose={onClose} />
        ) : (
          <>
            {/* STEP 0 – BASIC INFO */}
            {step === 0 && (
              <div className="px-10 pt-5 pb-12 space-y-4">
                <h3
                  className="text-md font-base mb-3"
                  style={{ color: "var(--accent)" }}
                >
                  Basic Details
                </h3>
                <div>
                  <label className="block text-sm text-white mb-2">
                    Your Username
                  </label>

                  <input
                    value={draft.username}
                    onChange={(e) =>
                      setDraft({ ...draft, username: e.target.value })
                    }
                    placeholder="Enter your username"
                    className="w-full mb-1 rounded-lg px-4 py-4 text-sm bg-transparent text-white placeholder:text-white/40 focus:outline-none placeholder:text-base"
                    style={{
                      border: `1px solid ${
                        draft.username && !isUsernameValid
                          ? "red"
                          : "rgba(255,255,255,0.4)"
                      }`,
                    }}
                  />

                  {/* Error message */}
                  {draft.username && !isUsernameValid && (
                    <p className="text-xs text-red-400 mt-1">
                      Username must be at least 4 characters and contain no
                      special symbols
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-white mb-2">
                    Main Topic
                  </label>

                  <div className="relative">
                    <select
                      value={draft.subject_id}
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
                      className="select-clean mb-1 w-full rounded-lg px-4 py-4 pr-12 text-sm bg-transparent text-white focus:outline-none"
                      style={{ border: "1px solid rgba(255,255,255,0.4)" }}
                    >
                      <option value="">Choose a main topic</option>
                      {subjects.map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.title}
                        </option>
                      ))}
                    </select>

                    {/* Custom Arrow */}
                    <span
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
                      style={{ color: "rgba(255,255,255,0.4)" }}
                    >
                      ▾
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-white mb-2">
                    Sub Topic
                  </label>

                  <div className="relative">
                    <select
                      disabled={!draft.subject_id}
                      value={draft.sub_subject_id}
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
                      className="select-clean w-full rounded-lg px-4 py-4 pr-12 text-sm bg-transparent text-white disabled:opacity-50 focus:outline-none"
                      style={{ border: "1px solid rgba(255,255,255,0.4)" }}
                    >
                      <option value="">First, choose the main topic</option>
                      {subSubjects.map((ss) => (
                        <option key={ss._id} value={ss._id}>
                          {ss.title}
                        </option>
                      ))}
                    </select>

                    {/* Custom Arrow */}
                    <span
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
                      style={{ color: "rgba(255,255,255,0.4)" }}
                    >
                      ▾
                    </span>
                  </div>
                </div>

                {/* MOVE FORWARD */}
                <button
                  disabled={!canMoveForward}
                  onClick={() => setStep(1)}
                  className="w-full mt-4 py-3 rounded-lg text-base font-bold text-black transition disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ backgroundColor: "var(--accent)" }}
                >
                  Move Forward →
                </button>
              </div>
            )}

            {step === 1 && (
              <div className="px-10 py-6 space-y-6">
                {/* TITLE */}
                <h3
                  className="text-white text-sm font-base"
                  style={{ color: "var(--accent)" }}
                >
                  Information Regarding Your{" "}
                  {
                    subSubjects.find((s) => s._id === draft.sub_subject_id)
                      ?.title
                  }{" "}
                  Request
                </h3>

                {/* DESCRIPTION FROM BACKEND */}
                <p className="text-sm leading-relaxed text-white/60">
                  {draft.description}
                </p>

                {/* CONTINUE BUTTON */}
                <button
                  disabled={counter > 0}
                  onClick={() => setStep(2)}
                  className="w-full py-3 rounded-lg text-base font-bold text-black flex items-center justify-center gap-2 transition disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: "var(--accent)",
                  }}
                >
                  Continue →{counter > 0 && <span>({counter})</span>}
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="px-10 py-6 space-y-6">
                {/* DESCRIPTION */}
                <div>
                  <label className="block text-xs text-white mb-1">
                    Describe Your Issue
                  </label>
                  <textarea
                    value={draft.description}
                    onChange={(e) =>
                      setDraft({ ...draft, description: e.target.value })
                    }
                    placeholder="Write your message here..."
                    className="w-full min-h-40 rounded-lg px-4 py-3 text-sm bg-transparent text-white placeholder:text-white/40 resize-none focus:outline-none"
                    style={{
                      border: "1px solid var(--accent)",
                      lineHeight: "1.9",
                    }}
                  />
                </div>

                {/* OR SEPARATOR */}
                <div className="flex items-center gap-3">
                  <div
                    className="flex-1 h-px"
                    style={{ backgroundColor: "var(--accent)" }}
                  />
                  <span className="text-xs text-white/60 uppercase">or</span>
                  <div
                    className="flex-1 h-px"
                    style={{ backgroundColor: "var(--accent)" }}
                  />
                </div>

                {/* RECORD AUDIO — SECONDARY */}
                <button
                  onClick={startRecording}
                  className="w-full py-3 rounded-lg text-sm font-medium text-white transition"
                  style={{
                    border: "1px solid var(--accent)",
                  }}
                >
                  🎙 Record Audio
                </button>

                {/* CONTINUE — PRIMARY */}
                <button
                  onClick={() => setStep(3)}
                  className="w-full py-3 rounded-lg text-base font-bold text-black transition"
                  style={{
                    backgroundColor: "var(--accent)",
                  }}
                >
                  Continue →
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="px-10 py-5 space-y-4">
                {/* HEADER */}
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-(--accent)">
                    Additional Files{" "}
                    <span className="text-white/50">(Optional)</span>
                  </span>
                  <span className="text-white/50">
                    {draft.files.length}/4 files uploaded
                  </span>
                </div>

                {/* DROPZONE */}
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();

                    if (draft.files.length >= 4) return;

                    const dropped = Array.from(e.dataTransfer.files);
                    const remaining = 4 - draft.files.length;

                    const filesToAdd = dropped.slice(0, remaining).map((f) => ({
                      file: f,
                      name: f.name,
                    }));

                    setDraft({
                      ...draft,
                      files: [...draft.files, ...filesToAdd],
                    });
                  }}
                  className="rounded-xl border border-dashed text-center py-10 transition"
                  style={{ borderColor: "rgba(255,255,255,0.4)" }}
                >
                  <input
                    type="file"
                    multiple
                    disabled={draft.files.length >= 4}
                    className="hidden"
                    id="file-upload"
                    onChange={(e) => {
                      const selected = Array.from(e.target.files || []);
                      const remaining = 4 - draft.files.length;

                      const filesToAdd = selected
                        .slice(0, remaining)
                        .map((f) => ({
                          file: f,
                          name: f.name,
                        }));

                      setDraft({
                        ...draft,
                        files: [...draft.files, ...filesToAdd],
                      });
                    }}
                  />

                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center gap-2 text-white/70"
                  >
                    <div className="text-xl">⬆</div>
                    <p className="text-sm">
                      Drag & drop files here or{" "}
                      <span className="underline">browse</span>
                    </p>
                    <p className="text-xs text-white/40">
                      (PDF/Photo: 10MB • Video: 50MB)
                    </p>
                  </label>
                </div>

                {/* FILE LIST */}
                {draft.files.length > 0 && (
                  <div className="space-y-2">
                    {draft.files.map((f, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 rounded-lg px-3 py-2"
                        style={{ border: "1px solid var(--accent)" }}
                      >
                        <input
                          value={f.name}
                          onChange={(e) => {
                            const updated = [...draft.files];
                            updated[idx] = {
                              ...updated[idx],
                              name: e.target.value,
                            };
                            setDraft({ ...draft, files: updated });
                          }}
                          className="flex-1 bg-transparent text-white text-sm focus:outline-none"
                        />

                        <button
                          onClick={() =>
                            setDraft({
                              ...draft,
                              files: draft.files.filter((_, i) => i !== idx),
                            })
                          }
                          className="text-red-400 text-xs hover:text-red-300"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* CONTINUE */}
                <button
                  onClick={() => setStep(step + 1)}
                  className="w-full mt-4 py-3 rounded-lg  text-base font-bold text-black"
                  style={{ backgroundColor: "var(--accent)" }}
                >
                  Continue →
                </button>
              </div>
            )}

            {step === 4 && (
              <div className="px-10 py-5 space-y-5">
                {/* TITLE */}
                <div>
                  <h3
                    className="text-lg font-base text-white"
                    style={{ color: "var(--accent)" }}
                  >
                    Return Channel
                  </h3>
                  <p className="text-sm text-white/50 mt-1">
                    Choose the channel through which you will receive feedback
                    regarding your request.
                  </p>
                </div>

                {/* OPTIONS */}
                {["Email", "Telephone", "Whatsapp", "Telegram"].map(
                  (option) => {
                    const value = option.toLowerCase();

                    const isSelected = draft.return_channel === value;

                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() =>
                          setDraft({ ...draft, return_channel: value })
                        }
                        className="w-full flex items-center gap-3 px-4 py-4 rounded-lg text-sm transition"
                        style={{
                          border: isSelected
                            ? "1px solid var(--accent)"
                            : "1px solid rgba(255,255,255,0.4)",
                          background: isSelected
                            ? "rgba(255,255,255,0.04)"
                            : "transparent",
                        }}
                      >
                        {/* RADIO */}
                        <span
                          className="h-4 w-4 rounded-full flex items-center justify-center"
                          style={{ border: "1px solid var(--accent)" }}
                        >
                          {isSelected && (
                            <span
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: "var(--accent)" }}
                            />
                          )}
                        </span>

                        <span
                          className={
                            isSelected ? "text-white" : "text-white/60"
                          }
                        >
                          {option}
                        </span>
                      </button>
                    );
                  }
                )}

                {/* CONTINUE */}
                <button
                  disabled={!draft.return_channel}
                  onClick={() => setStep(step + 1)}
                  className="w-full mt-4 py-3 rounded-lg text-base font-bold transition"
                  style={{
                    backgroundColor: draft.return_channel
                      ? "var(--accent)"
                      : "rgba(255,255,255,0.2)",
                    color: draft.return_channel ? "#000" : "#999",
                    cursor: draft.return_channel ? "pointer" : "not-allowed",
                  }}
                >
                  Continue →
                </button>
              </div>
            )}

            {step === 5 && (
              <div className="px-10 py-6 space-y-6 text-sm">
                {/* TITLE */}
                <h3
                  className="text-base font-medium"
                  style={{ color: "var(--accent)" }}
                >
                  Request Summary
                </h3>

                {/* SUMMARY */}
                <div className="space-y-2 text-white/70">
                  <div className="flex gap-3">
                    <span className="w-44 text-white/50">Username:</span>
                    <span className="text-white">{draft.username}</span>
                  </div>

                  <div className="flex gap-3">
                    <span className="w-44 text-white/50">Subject:</span>
                    <span className="text-white">
                      {subjects.find((s) => s._id === draft.subject_id)?.title}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <span className="w-44 text-white/50">Request Details:</span>
                    <span className="text-white line-clamp-2">
                      {draft.description || "-"}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <span className="w-44 text-white/50">
                      Number of Attached Files:
                    </span>
                    <span className="text-white">{draft.files.length}</span>
                  </div>

                  <div className="flex gap-3">
                    <span className="w-44 text-white/50">Return Channel:</span>
                    <span className="capitalize text-white">
                      {draft.return_channel}
                    </span>
                  </div>
                </div>

                {/* DIVIDER */}
                <div className="h-px bg-white/10" />

                {/* SEND BUTTON — FINAL ACTION */}
                <button
                  onClick={submitTicket}
                  className="w-full mt-4 py-4 rounded-lg text-base font-bold text-black transition"
                  style={{ backgroundColor: "var(--accent)" }}
                >
                  Send →
                </button>
              </div>
            )}
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
}: {
  ticket: string;
  onClose: () => void;
}) {
  return (
    <div className="text-center space-y-4 p-6">
      <h3 className="text-lg font-semibold">Ticket Created 🎉</h3>
      <div className="border rounded p-3 font-mono">{ticket}</div>
      <button className="btn" onClick={onClose}>
        Close
      </button>
    </div>
  );
}

// "use client";

// import { useEffect, useRef, useState } from "react";
// import api from "@/lib/axios";

// type Subject = {
//   _id: string;
//   title: string;
//   sub_subjects: {
//     _id: string;
//     title: string;
//     predefined_text: string;
//   }[];
// };

// const TOTAL_STEPS = 6;
// const DEFAULT_PRIMARY = "#AD9E70";

// export default function RaiseTicketModal({
//   open,
//   onClose,
//   primarycolor,
// }: {
//   open: boolean;
//   onClose: () => void;
//   primarycolor: string;
// }) {
//   const accent = primarycolor || DEFAULT_PRIMARY;
//   const [step, setStep] = useState(0);
//   const [subjects, setSubjects] = useState<Subject[]>([]);
//   const [subSubjects, setSubSubjects] = useState<any[]>([]);
//   const [successTicket, setSuccessTicket] = useState<string | null>(null);
//   const [counter, setCounter] = useState(5);

//   const [draft, setDraft] = useState({
//     username: "",
//     subject_id: "",
//     sub_subject_id: "",
//     description: "",
//     audio: null as Blob | null,
//     files: [] as { file: File; name: string }[],
//     return_channel: "email",
//   });

//   /* ---------------- Fetch Subjects ---------------- */
//   useEffect(() => {
//     api.get("/subjects").then((res) => setSubjects(res.data.data));
//   }, []);

//   /* ---------------- Step 2 Timer ---------------- */
//   useEffect(() => {
//     if (step === 1 && counter > 0) {
//       const t = setTimeout(() => setCounter((c) => c - 1), 1000);
//       return () => clearTimeout(t);
//     }
//   }, [step, counter]);

//   /* ---------------- Audio Recording ---------------- */
//   const mediaRecorder = useRef<MediaRecorder | null>(null);

//   const startRecording = async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//     const recorder = new MediaRecorder(stream);
//     const chunks: BlobPart[] = [];

//     recorder.ondataavailable = (e) => chunks.push(e.data);
//     recorder.onstop = () =>
//       setDraft((d) => ({
//         ...d,
//         audio: new Blob(chunks, { type: "audio/webm" }),
//       }));

//     recorder.start();
//     mediaRecorder.current = recorder;
//   };

//   const stopRecording = () => mediaRecorder.current?.stop();

//   /* ---------------- Submit ---------------- */
//   const submitTicket = async () => {
//     const fd = new FormData();

//     fd.append("username", draft.username);
//     fd.append("subject_id", draft.subject_id);
//     fd.append("sub_subject_id", draft.sub_subject_id);
//     fd.append("description", draft.description);
//     fd.append("return_channel", draft.return_channel);

//     if (draft.audio) {
//       fd.append("audio", draft.audio);
//     }

//     draft.files.forEach((f) => {
//       fd.append("files", f.file, f.name);
//     });

//     const res = await api.post("/tickets/create", fd);
//     setSuccessTicket(res.data.data.ticket_number);
//   };

//   if (!open) return null;

//   /* ================================================= */

//   return (
//     <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
//       <div className="bg-blue-950 w-full max-w-3xl rounded-lg shadow-lg p-6">
//         {/* HEADER */}
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold">Request for Quick Support</h2>
//           <button onClick={onClose}>✕</button>
//         </div>

//         {/* SUCCESS */}
//         {successTicket ? (
//           <SuccessScreen ticket={successTicket} onClose={onClose} />
//         ) : (
//           <>
//             {/* STEP CONTENT */}
//             <div className="min-h-65">
//               {/* STEP 0 – BASIC INFO */}
//               {step === 0 && (
//                 <>
//                   <h3>Your Username</h3>
//                   <input
//                     className="input mb-3"
//                     placeholder="Enter your username"
//                     value={draft.username}
//                     onChange={(e) =>
//                       setDraft({ ...draft, username: e.target.value })
//                     }
//                   />

//                   <h3>Main Topic</h3>
//                   <select
//                     className="input mb-3"
//                     value={draft.subject_id}
//                     onChange={(e) => {
//                       const subject = subjects.find(
//                         (s) => s._id === e.target.value
//                       );
//                       setSubSubjects(subject?.sub_subjects || []);
//                       setDraft({
//                         ...draft,
//                         subject_id: e.target.value,
//                         sub_subject_id: "",
//                       });
//                     }}
//                   >
//                     <option value="">Choose a main topic</option>
//                     {subjects.map((s) => (
//                       <option key={s._id} value={s._id}>
//                         {s.title}
//                       </option>
//                     ))}
//                   </select>

//                   <h3>Sub Topic</h3>
//                   <select
//                     className="input mb-3"
//                     disabled={!draft.subject_id}
//                     value={draft.sub_subject_id}
//                     onChange={(e) => {
//                       const ss = subSubjects.find(
//                         (x) => x._id === e.target.value
//                       );
//                       setDraft({
//                         ...draft,
//                         sub_subject_id: e.target.value,
//                         description: ss?.predefined_text || "",
//                       });
//                     }}
//                   >
//                     <option value="">First, choose the main topic</option>
//                     {subSubjects.map((ss) => (
//                       <option key={ss._id} value={ss._id}>
//                         {ss.title}
//                       </option>
//                     ))}
//                   </select>
//                 </>
//               )}

//               {/* STEP 1 – INFO NOTE */}
//               {step === 1 && (
//                 <>
//                   <p className="text-sm text-gray-600">
//                     Please read this information carefully before continuing.
//                   </p>
//                   <button
//                     disabled={counter > 0}
//                     className="btn mt-4"
//                     onClick={() => setStep(2)}
//                   >
//                     Continue {counter > 0 && `(${counter})`}
//                   </button>
//                 </>
//               )}

//               {/* STEP 2 – DESCRIPTION + AUDIO */}
//               {step === 2 && (
//                 <>
//                   <textarea
//                     className="input h-32"
//                     value={draft.description}
//                     onChange={(e) =>
//                       setDraft({ ...draft, description: e.target.value })
//                     }
//                   />
//                   <div className="mt-3 space-x-2">
//                     <button className="btn" onClick={startRecording}>
//                       Record Audio
//                     </button>
//                     <button className="btn-danger" onClick={stopRecording}>
//                       Stop
//                     </button>
//                   </div>
//                 </>
//               )}

//               {/* STEP 3 – FILES */}
//               {step === 3 && (
//                 <input
//                   type="file"
//                   multiple
//                   onChange={(e) =>
//                     setDraft({
//                       ...draft,
//                       files: Array.from(e.target.files || []).map((f) => ({
//                         file: f,
//                         name: f.name,
//                       })),
//                     })
//                   }
//                 />
//               )}

//               {/* STEP 4 – RETURN CHANNEL */}
//               {step === 4 && (
//                 <div className="space-y-2">
//                   {["whatsapp", "telegram", "telephone", "email"].map((c) => (
//                     <label key={c} className="flex gap-2 items-center">
//                       <input
//                         type="radio"
//                         checked={draft.return_channel === c}
//                         onChange={() =>
//                           setDraft({ ...draft, return_channel: c })
//                         }
//                       />
//                       {c}
//                     </label>
//                   ))}
//                 </div>
//               )}

//               {/* STEP 5 – PREVIEW */}
//               {step === 5 && (
//                 <div className="text-sm space-y-2">
//                   <p>User: {draft.username}</p>
//                   <p>Channel: {draft.return_channel}</p>
//                   <p>Files: {draft.files.length}</p>
//                 </div>
//               )}
//             </div>

//             {/* FOOTER */}
//             <div className="flex justify-between mt-6">
//               <button
//                 disabled={step === 0}
//                 onClick={() => setStep(step - 1)}
//                 className="btn-outline"
//               >
//                 Back
//               </button>

//               {step < TOTAL_STEPS - 1 ? (
//                 <button className="btn" onClick={() => setStep(step + 1)}>
//                   Next
//                 </button>
//               ) : (
//                 <button className="btn" onClick={submitTicket}>
//                   Submit
//                 </button>
//               )}
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// /* ================= SUCCESS ================= */

// function SuccessScreen({
//   ticket,
//   onClose,
// }: {
//   ticket: string;
//   onClose: () => void;
// }) {
//   return (
//     <div className="text-center space-y-4">
//       <h3 className="text-lg font-semibold">Ticket Created 🎉</h3>
//       <div className="border rounded p-3 font-mono">{ticket}</div>

//       <div className="flex justify-center gap-3">
//         <button className="btn" onClick={onClose}>
//           Close
//         </button>
//       </div>
//     </div>
//   );
// }
