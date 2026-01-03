"use client";

import { useEffect, useRef, useState } from "react";
import api from "@/lib/axios";

const TOTAL_STEPS = 3;

export default function RequestCallbackModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState(0);
  const [successModal, setSuccessModal] = useState<boolean>(false);
  const [counter, setCounter] = useState(3);
  const [isMember, setIsMember] = useState<boolean>(true);
  const [draft, setDraft] = useState({
    username: "",
    phone: "",
    issue: "",
    audio: null as Blob | null,
    preferred_time: "",
  });
  const [timeSlots, setTimeSlots] = useState<string[]>([]);

  const submitCallbackRequest = async () => {
    const fd = new FormData();

    fd.append("username", draft.username);
    fd.append("phone", draft.phone);
    fd.append("issue", draft.issue);
    fd.append("preferred_time", draft.preferred_time);
    if (draft.audio) {
      fd.append("audio", draft.audio);
    }

    const res = await api.post("/tickets/request-callback", fd);
    setSuccessModal(true);
  };

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
  useEffect(() => {
    if (step === 1 && counter > 0) {
      let hr = new Date().getHours();
      let min = new Date().getMinutes();
      min = min + (10 - (min % 10));
      hr += 3;
      const arr: string[] = [];
      for (let i = 0; i < 8; i++) {
        if (min >= 60) {
          hr += 1;
          min = 0;
        }
        if (hr > 23) {
          hr = 0;
        }
        arr.push(
          `${hr.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`
        );
        min += 10;
      }
      setTimeSlots(arr);
    }
  }, [step, counter]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-blue-950 w-full max-w-3xl rounded-lg shadow-lg p-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Request Callback</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* SUCCESS */}
        {successModal ? (
          <SuccessScreen onClose={onClose} />
        ) : (
          <>
            {/* STEP CONTENT */}
            <div className="min-h-65">
              {/* STEP 0 – BASIC INFO */}
              {step === 0 && (
                <>
                  <p>Are you an existing member?</p>
                  <label key="yes" className="flex gap-2 items-center">
                    <input
                      type="radio"
                      checked={isMember}
                      onChange={() => setIsMember(true)}
                    />
                    Yes
                  </label>
                  <label key="no" className="flex gap-2 items-center">
                    <input
                      type="radio"
                      checked={!isMember}
                      onChange={() => setIsMember(false)}
                    />
                    No
                  </label>
                  {isMember ? (
                    <input
                      className="input"
                      placeholder="Username"
                      value={draft.username}
                      onChange={(e) =>
                        setDraft({ ...draft, username: e.target.value })
                      }
                    />
                  ) : (
                    <input
                      className="input"
                      placeholder="Phone Number"
                      value={draft.phone}
                      onChange={(e) =>
                        setDraft({ ...draft, phone: e.target.value })
                      }
                    />
                  )}
                </>
              )}

              {/* STEP 2 – DESCRIPTION + AUDIO */}
              {step === 1 && (
                <>
                  <textarea
                    className="input h-32"
                    value={draft.issue}
                    onChange={(e) =>
                      setDraft({ ...draft, issue: e.target.value })
                    }
                  />
                  <div className="mt-3 space-x-2">
                    <button className="btn" onClick={startRecording}>
                      Record Audio
                    </button>
                    <button className="btn-danger" onClick={stopRecording}>
                      Stop
                    </button>
                  </div>
                </>
              )}

              {step === 2 && (
                <div className="space-y-2">
                  {timeSlots.map((c) => (
                    <label key={c} className="flex gap-2 items-center">
                      <input
                        type="radio"
                        checked={draft.preferred_time === c}
                        onChange={() =>
                          setDraft({ ...draft, preferred_time: c })
                        }
                      />
                      {c}
                    </label>
                  ))}
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

              {step < TOTAL_STEPS - 1 ? (
                <button className="btn" onClick={() => setStep(step + 1)}>
                  Next
                </button>
              ) : (
                <button className="btn" onClick={submitCallbackRequest}>
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

function SuccessScreen({ onClose }: { onClose: () => void }) {
  return (
    <div className="text-center space-y-4">
      <h3 className="text-lg font-semibold">Callback Requested </h3>
      <div className="flex justify-center gap-3">
        <button className="btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
