"use client";

import { useEffect, useRef, useState } from "react";
import api from "@/lib/axios";
import { IconUser, IconPhone, IconCheck } from "@tabler/icons-react";
import { motion } from "framer-motion";

const TOTAL_STEPS = 3;
const DEFAULT_PRIMARY = "#AD9E70";

export default function RequestCallbackModal({
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
  const [successModal, setSuccessModal] = useState(false);
  const [counter, setCounter] = useState(3);
  const [isMember, setIsMember] = useState(true);

  const [draft, setDraft] = useState({
    username: "",
    phone: "",
    issue: "",
    audio: null as Blob | null,
    preferred_time: "",
  });

  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const mediaRecorder = useRef<MediaRecorder | null>(null);

  const handleClose = () => {
    setStep(0);
    setSuccessModal(false);
    setCounter(3);
    setIsMember(true);
    setDraft({
      username: "",
      phone: "",
      issue: "",
      audio: null,
      preferred_time: "",
    });
    onClose();
  };

  /* ---------------- Submit ---------------- */
  const submitCallbackRequest = async () => {
    const fd = new FormData();
    fd.append("username", draft.username);
    fd.append("phone", draft.phone);
    fd.append("issue", draft.issue);
    fd.append("preferred_time", draft.preferred_time);
    if (draft.audio) fd.append("audio", draft.audio);

    await api.post("/tickets/create/request-callback", fd);
    setSuccessModal(true);
  };

  /* ---------------- Audio ---------------- */
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

  /* ---------------- Time Slots ---------------- */
  useEffect(() => {
    if (step === 1 && counter > 0) {
      let hr = new Date().getHours() + 3;
      let min = new Date().getMinutes();
      min += 10 - (min % 10);

      const arr: string[] = [];
      for (let i = 0; i < 8; i++) {
        if (min >= 60) {
          hr++;
          min = 0;
        }
        if (hr > 23) hr = 0;

        arr.push(
          `${hr.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`
        );
        min += 10;
      }
      setTimeSlots(arr);
    }
  }, [step, counter]);

  if (!open) return null;

  /*---------------------username and phone <check-------------------*/
  const canMoveForward = isMember
    ? draft.username.trim().length > 0
    : draft.phone.trim().length > 0;

  const canSubmit = Boolean(draft.preferred_time);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 sm:px-6"
      style={{ ["--accent" as any]: accent }}
    >
      <div
        className="w-full max-w-130 rounded-2xl bg-[#0A0A0A] shadow-[0_0_60px_rgba(0,0,0,0.9)]"
        style={{ border: "1px solid var(--accent)" }}
      >
        {/* HEADER */}
        <div className="px-5 sm:px-10 pt-6 sm:pt-8 pb-1">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-medium text-2xl sm:text-2xl pt-3">
              Request Callback
            </h2>
            <button
              onClick={handleClose}
              className="text-white hover:text-white/70 text-xl sm:text-2xl pt-3"
            >
              ✕
            </button>
          </div>

          <div
            className="mt-4 sm:mt-5"
            style={{
              borderBottom: "1px solid rgba(255,255,255,0.3)",
              marginInline: "4px",
            }}
          />
        </div>

        {successModal ? (
          <SuccessScreen onClose={handleClose} onPrimaryAction={handleClose} />
        ) : (
          <>
            {/* STEP CONTENT */}
            <div className="px-5 sm:px-10 py-5 sm:py-6 space-y-5 min-h-65">
              {step === 0 && (
                <div className="space-y-4">
                  {/* Subtitle */}
                  <p
                    className="text-sm mb-6"
                    style={{ color: "var(--accent)" }}
                  >
                    Enter your information.
                  </p>

                  {/* Membership question */}
                  <div className="space-y-2">
                    <p className="text-sm font-base text-white">
                      Do you have a membership?
                    </p>

                    <div className="grid grid-cols-2 mb-5 gap-3">
                      <button
                        type="button"
                        onClick={() => setIsMember(false)}
                        className="py-3 rounded-lg text-sm font-medium transition"
                        style={{
                          backgroundColor: !isMember
                            ? "var(--accent)"
                            : "transparent",
                          color: !isMember ? "#000" : "rgba(255,255,255)",
                          border: "1px solid rgba(255,255,255,0.3)",
                        }}
                      >
                        No
                      </button>

                      {/* YES */}
                      <button
                        type="button"
                        onClick={() => setIsMember(true)}
                        className="py-3 rounded-lg text-sm font-medium transition"
                        style={{
                          backgroundColor: isMember
                            ? "var(--accent)"
                            : "transparent",
                          color: isMember ? "#000" : "rgba(255,255,255)",
                          border: "1px solid rgba(255,255,255,0.3)",
                        }}
                      >
                        Yes
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 mb-5">
                    <label className="text-sm font-base text-white">
                      {isMember ? "Your Username" : "Phone Number"}
                    </label>

                    <div
                      className="flex items-center gap-3 px-4 py-3 rounded-lg"
                      style={{ border: "1px solid rgba(255,255,255,0.3)" }}
                    >
                      <span className="text-white/60">
                        {isMember ? (
                          <IconUser size={18} stroke={1.5} />
                        ) : (
                          <IconPhone size={18} stroke={1.5} />
                        )}
                      </span>

                      <input
                        placeholder={
                          isMember ? "Enter your username" : "+90 5XX XXX XX XX"
                        }
                        value={isMember ? draft.username : draft.phone}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            [isMember ? "username" : "phone"]: e.target.value,
                          })
                        }
                        className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Forward */}
                  <button
                    onClick={() => setStep(1)}
                    disabled={!canMoveForward}
                    className="w-full py-3 rounded-lg text-sm font-bold text-black transition
             disabled:opacity-40 disabled:cursor-not-allowed mb-5"
                    style={{ backgroundColor: "var(--accent)" }}
                  >
                    Move Forward →
                  </button>
                </div>
              )}

              {/* STEP 1 */}
              {step === 1 && (
                <div className="space-y-4">
                  {/* Subtitle */}
                  <p
                    className="text-sm mb-2"
                    style={{ color: "var(--accent)" }}
                  >
                    Explain your request
                  </p>

                  {/* Textarea */}
                  <textarea
                    value={draft.issue}
                    onChange={(e) =>
                      setDraft({ ...draft, issue: e.target.value })
                    }
                    placeholder="Briefly describe your problem (or record a voice message)..."
                    className="w-full min-h-35 rounded-lg px-4 py-3 text-sm bg-transparent text-white placeholder:text-white/40 resize-none focus:outline-none mb-1 "
                    style={{ border: "1px solid rgba(255,255,255,0.3)" }}
                  />
                  {/* OR */}
                  <p
                    className="text-s text-center mb-2"
                    style={{ color: "var(--accent)" }}
                  >
                    OR
                  </p>

                  {/* Record button */}
                  <button
                    onClick={startRecording}
                    className="w-full py-3 rounded-lg text-sm font-medium mb-3"
                    style={{
                      border: "1px solid var(--accent)",
                      color: "var(--accent)",
                      backgroundColor: "transparent",
                    }}
                  >
                    Start Recording
                  </button>

                  {/* Note */}
                  <p className="text-xs text-center text-white/50 mb-6">
                    Note: You can submit your request using text (at least 20
                    characters) or audio (5–120 seconds).
                  </p>

                  {/* Forward */}
                  <button
                    onClick={() => setStep(2)}
                    className="w-full py-3 rounded-lg text-md font-bold text-black hover:opacity-90 mt-2 mb-6"
                    style={{ backgroundColor: "var(--accent)" }}
                  >
                    Move Forward →
                  </button>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div className="space-y-6">
                  {/* Title */}
                  <p
                    className="text-sm font-base mb-3"
                    style={{ color: "var(--accent)" }}
                  >
                    Preferred Time
                  </p>

                  {/* Time slots */}
                  <div className="grid grid-cols-3 gap-3">
                    {timeSlots.map((c) => {
                      const selected = draft.preferred_time === c;

                      return (
                        <button
                          key={c}
                          onClick={() =>
                            setDraft({ ...draft, preferred_time: c })
                          }
                          className="py-4 rounded-lg text-sm font-medium transition"
                          style={{
                            border: selected
                              ? "1px solid var(--accent)"
                              : "1px solid rgba(255,255,255,0.35)",
                            backgroundColor: selected
                              ? "rgba(255,255,255,0.04)"
                              : "transparent",
                            color: selected
                              ? "var(--accent)"
                              : "rgba(255,255,255,0.75)",
                          }}
                        >
                          {c}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={submitCallbackRequest}
                    disabled={!canSubmit}
                    className="w-full py-3 rounded-lg text-md font-bold text-black transition
             disabled:opacity-40 disabled:cursor-not-allowed mb-5"
                    style={{ backgroundColor: "var(--accent)" }}
                  >
                    Submit Request →
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------------- SUCCESS ---------------- */

function SuccessScreen({
  onClose,
  onPrimaryAction,
}: {
  onClose: () => void;
  onPrimaryAction?: () => void;
}) {
  return (
    <div className="px-5 sm:px-10 py-10 sm:py-12 flex flex-col space-y-6">
      {/* Success Icon */}
      <div className="flex justify-center items-center">
        <motion.svg
          width="60"
          height="60"
          viewBox="0 0 52 52"
          initial="hidden"
          animate="visible"
        >
          {/* Filled Circle */}
          <motion.circle
            cx="26"
            cy="26"
            r="24"
            fill="#22c55e"
            variants={{
              hidden: { scale: 0 },
              visible: {
                scale: 1,
                transition: {
                  duration: 0.45,
                  ease: "easeOut",
                },
              },
            }}
          />

          {/* Tick */}
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
      </div>

      <h1 className="text-md font-base text-white/60">
        Your callback request has been received. Our team will reach out to you
        at your selected time slot.
      </h1>

      {/* Primary CTA */}
      <button
        onClick={onPrimaryAction}
        className="w-full py-3 rounded-lg text-sm font-bold text-black text-center items-center hover:opacity-90"
        style={{ backgroundColor: "var(--accent)" }}
      >
        Go to the Website
      </button>

      {/* Secondary CTA */}
      <button
        onClick={onClose}
        className="w-full py-3 rounded-lg text-sm font-medium transition text-center
             border border-white/60 text-white/60 bg-transparent
             hover:bg-(--accent) hover:text-black hover:font-bold hover:border-(--accent)"
      >
        Close
      </button>
    </div>
  );
}

// "use client";

// import { useEffect, useRef, useState } from "react";
// import api from "@/lib/axios";

// const TOTAL_STEPS = 3;

// export default function RequestCallbackModal({
//   open,
//   onClose,
//   primarycolor,
// }: {
//   open: boolean;
//   onClose: () => void;
//   primarycolor: string;
// }) {
//   const [step, setStep] = useState(0);
//   const [successModal, setSuccessModal] = useState<boolean>(false);
//   const [counter, setCounter] = useState(3);
//   const [isMember, setIsMember] = useState<boolean>(true);
//   const [draft, setDraft] = useState({
//     username: "",
//     phone: "",
//     issue: "",
//     audio: null as Blob | null,
//     preferred_time: "",
//   });
//   const [timeSlots, setTimeSlots] = useState<string[]>([]);

//   const submitCallbackRequest = async () => {
//     const fd = new FormData();

//     fd.append("username", draft.username);
//     fd.append("phone", draft.phone);
//     fd.append("issue", draft.issue);
//     fd.append("preferred_time", draft.preferred_time);
//     if (draft.audio) {
//       fd.append("audio", draft.audio);
//     }

//     const res = await api.post("/tickets/create/request-callback", fd);
//     setSuccessModal(true);
//   };

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
//   useEffect(() => {
//     if (step === 1 && counter > 0) {
//       let hr = new Date().getHours();
//       let min = new Date().getMinutes();
//       min = min + (10 - (min % 10));
//       hr += 3;
//       const arr: string[] = [];
//       for (let i = 0; i < 8; i++) {
//         if (min >= 60) {
//           hr += 1;
//           min = 0;
//         }
//         if (hr > 23) {
//           hr = 0;
//         }
//         arr.push(
//           `${hr.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`
//         );
//         min += 10;
//       }
//       setTimeSlots(arr);
//     }
//   }, [step, counter]);

//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
//       <div className="bg-blue-950 w-full max-w-3xl rounded-lg shadow-lg p-6">
//         {/* HEADER */}
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold">Request Callback</h2>
//           <button onClick={onClose}>✕</button>
//         </div>

//         {/* SUCCESS */}
//         {successModal ? (
//           <SuccessScreen onClose={onClose} />
//         ) : (
//           <>
//             {/* STEP CONTENT */}
//             <div className="min-h-65">
//               {/* STEP 0 – BASIC INFO */}
//               {step === 0 && (
//                 <>
//                   <p>Are you an existing member?</p>
//                   <label key="yes" className="flex gap-2 items-center">
//                     <input
//                       type="radio"
//                       checked={isMember}
//                       onChange={() => setIsMember(true)}
//                     />
//                     Yes
//                   </label>
//                   <label key="no" className="flex gap-2 items-center">
//                     <input
//                       type="radio"
//                       checked={!isMember}
//                       onChange={() => setIsMember(false)}
//                     />
//                     No
//                   </label>
//                   {isMember ? (
//                     <input
//                       className="input"
//                       placeholder="Username"
//                       value={draft.username}
//                       onChange={(e) =>
//                         setDraft({ ...draft, username: e.target.value })
//                       }
//                     />
//                   ) : (
//                     <input
//                       className="input"
//                       placeholder="Phone Number"
//                       value={draft.phone}
//                       onChange={(e) =>
//                         setDraft({ ...draft, phone: e.target.value })
//                       }
//                     />
//                   )}
//                 </>
//               )}

//               {/* STEP 2 – DESCRIPTION + AUDIO */}
//               {step === 1 && (
//                 <>
//                   <textarea
//                     className="input h-32"
//                     value={draft.issue}
//                     onChange={(e) =>
//                       setDraft({ ...draft, issue: e.target.value })
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

//               {step === 2 && (
//                 <div className="space-y-2">
//                   {timeSlots.map((c) => (
//                     <label key={c} className="flex gap-2 items-center">
//                       <input
//                         type="radio"
//                         checked={draft.preferred_time === c}
//                         onChange={() =>
//                           setDraft({ ...draft, preferred_time: c })
//                         }
//                       />
//                       {c}
//                     </label>
//                   ))}
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
//                 <button className="btn" onClick={submitCallbackRequest}>
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

// function SuccessScreen({ onClose }: { onClose: () => void }) {
//   return (
//     <div className="text-center space-y-4">
//       <h3 className="text-lg font-semibold">Callback Requested </h3>
//       <div className="flex justify-center gap-3">
//         <button className="btn" onClick={onClose}>
//           Close
//         </button>
//       </div>
//     </div>
//   );
// }
