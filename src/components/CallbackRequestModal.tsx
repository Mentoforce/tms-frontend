"use client";

import { useEffect, useRef, useState } from "react";
import api from "@/lib/axios";
import { IconUser, IconPhone, IconCheck } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { useOrganisation } from "@/context/OrganisationProvider";
import { useRouter } from "next/navigation";
import { ThemeType } from "@/types/context-types";

const DEFAULT_PRIMARY = "#DFD1A1";

export default function RequestCallbackModal({
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

  const usernameRegex = /^[a-zA-Z0-9]{4,}$/;
  const isUsernameValid = usernameRegex.test(draft.username);
  const { organisation } = useOrganisation();
  const router = useRouter();

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

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

  const primaryAction = () => {
    if (!organisation?.link || organisation?.link == "/") {
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
    }
    router.push(organisation?.link || "/");
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

  /* ---------------- Audio Recording ---------------- */
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recordingInterval = useRef<NodeJS.Timeout | null>(null);

  const MAX_RECORDING_TIME = 120; // 2 minutes

  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const [recordingElapsed, setRecordingElapsed] = useState(0); // seconds
  const [recordedDuration, setRecordedDuration] = useState(0); // final duration

  const [playProgress, setPlayProgress] = useState(0);

  // time formatter
  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  /* ---------- START RECORDING ---------- */
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    const chunks: BlobPart[] = [];

    recorder.ondataavailable = (e) => chunks.push(e.data);

    recorder.onstop = () => {
      const audioBlob = new Blob(chunks, { type: "audio/webm" });

      setDraft((d) => ({ ...d, audio: audioBlob }));
      setAudioUrl(URL.createObjectURL(audioBlob));
      // setRecordedDuration(recordingElapsed);

      setIsRecording(false);
      setRecordingElapsed(0);

      stream.getTracks().forEach((t) => t.stop());
      if (recordingInterval.current) clearInterval(recordingInterval.current);
    };

    recorder.start();
    mediaRecorder.current = recorder;

    setIsRecording(true);
    setRecordingElapsed(0);

    recordingInterval.current = setInterval(() => {
      setRecordingElapsed((prev) => {
        if (prev + 1 >= MAX_RECORDING_TIME) {
          recorder.stop();
          return MAX_RECORDING_TIME;
        }
        return prev + 1;
      });
    }, 1000);
  };

  /* ---------- STOP RECORDING ---------- */
  const stopRecording = () => {
    mediaRecorder.current?.stop();
    if (recordingInterval.current) clearInterval(recordingInterval.current);
  };

  /* ---------- DELETE RECORDING ---------- */
  const deleteRecording = () => {
    // Stop any playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = ""; // clear the source
    }

    // Revoke blob URL to free memory
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }

    // Reset state
    setDraft((d) => ({ ...d, audio: null }));
    setAudioUrl(null);
    setRecordedDuration(0);
    setPlayProgress(0);
    setIsPlaying(false);
    setIsRecording(false);
  };

  /* ---------- PLAY / PAUSE AUDIO ---------- */
  const togglePlayAudio = () => {
    if (!audioUrl) return;

    if (!audioRef.current) {
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onloadedmetadata = () => {
        setRecordedDuration(audio.duration);
      };

      audio.ontimeupdate = () => {
        setPlayProgress(audio.currentTime);
      };

      audio.onended = () => {
        setIsPlaying(false);
        setPlayProgress(0);
      };
    }

    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  /* ---------- PROGRESS ---------- */
  const recordingPercent = (recordingElapsed / MAX_RECORDING_TIME) * 100;
  const playPercent =
    recordedDuration > 0 ? (playProgress / recordedDuration) * 100 : 0;

  /* ---------------- Time Slots ---------------- */
  useEffect(() => {
    if (step === 1 && counter > 0) {
      let hr = new Date().getHours() + 3;
      let min = new Date().getMinutes();
      min += 10 - (min % 10);

      const arr: string[] = [];
      for (let i = 0; i < 9; i++) {
        if (min >= 60) {
          hr++;
          min = 0;
        }
        if (hr > 23) hr = 0;

        arr.push(
          `${hr.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`,
        );
        min += 10;
      }
      setTimeSlots(arr);
    }
  }, [step, counter]);

  if (!open) return null;

  /*---------------------username and phone check-------------------*/
  const canMoveForward = isMember
    ? draft.username.trim().length > 0 && isUsernameValid
    : draft.phone.trim().length > 0;

  const isTextValid = draft.issue.trim().length >= 20;
  const isAudioValid = !!draft.audio;
  const canContinue = isTextValid || isAudioValid;

  const canSubmit = Boolean(draft.preferred_time);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 sm:px-6"
      style={{ color: primarycolor }}
    >
      <div
        className="w-full max-w-130 rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.9)]"
        style={{
          backgroundColor: modalBgColor,
          border: `1px solid ${borderColor}`,
        }}
      >
        {/* HEADER */}
        <div className="px-5 sm:px-10 pt-6 sm:pt-8 pb-1">
          <div className="flex items-center justify-between">
            <h2 className="font-medium text-xl sm:text-2xl pt-3">
              Request Callback
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
            className="mt-4 sm:mt-5 opacity-40"
            style={{
              borderBottom: `1px solid ${borderColor}`,
              marginInline: "4px",
            }}
          />
        </div>

        {successModal ? (
          <SuccessScreen
            onClose={handleClose}
            onPrimaryAction={primaryAction}
            primarycolor={primarycolor}
            modalBgColor={modalBgColor}
          />
        ) : (
          <>
            {/* STEP CONTENT */}
            <div className="px-5 sm:px-10 py-5 sm:py-6 space-y-5 min-h-65">
              {step === 0 && (
                <div className="space-y-4">
                  {/* Subtitle */}
                  <p className="text-sm mb-6" style={{ color: primarycolor }}>
                    Enter your information.
                  </p>

                  {/* Membership question */}
                  <div className="space-y-2">
                    <p className="text-sm font-base">
                      Do you have a membership?
                    </p>

                    <div className="grid grid-cols-2 mb-5 gap-3">
                      <button
                        type="button"
                        onClick={() => setIsMember(false)}
                        className="py-3 rounded-lg text-sm font-medium transition cursor-pointer"
                        style={{
                          backgroundColor: !isMember
                            ? primarycolor
                            : "transparent",
                          color: !isMember ? modalBgColor : primarycolor,
                          border: `1px solid ${borderColor}`,
                        }}
                      >
                        No
                      </button>

                      {/* YES */}
                      <button
                        type="button"
                        onClick={() => setIsMember(true)}
                        className="py-3 rounded-lg text-sm font-medium transition cursor-pointer"
                        style={{
                          backgroundColor: isMember
                            ? primarycolor
                            : "transparent",
                          color: isMember ? modalBgColor : primarycolor,
                          border: `1px solid ${borderColor}`,
                        }}
                      >
                        Yes
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 mb-5">
                    <label className="text-sm font-base">
                      {isMember ? "Your Username" : "Phone Number"}
                    </label>

                    <div
                      className="flex items-center gap-3 px-4 py-3 rounded-lg"
                      style={{ border: `1px solid ${borderColor}` }}
                    >
                      <span style={{ color: primarycolor, opacity: 0.6 }}>
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
                        className="flex-1 bg-transparent text-sm focus:outline-none"
                        style={{ color: primarycolor }}
                      />
                    </div>
                    {draft.username && !isUsernameValid && (
                      <p className="text-xs text-red-400 mt-1">
                        Username must be at least 4 characters and contain no
                        special symbols
                      </p>
                    )}
                  </div>

                  {/* Forward */}
                  <button
                    onClick={() => setStep(1)}
                    disabled={!canMoveForward}
                    className="cursor-pointer w-full py-3 rounded-lg text-sm font-bold transition disabled:opacity-40 disabled:cursor-not-allowed mb-5"
                    style={{
                      backgroundColor: primarycolor,
                      color: modalBgColor,
                    }}
                  >
                    Move Forward →
                  </button>
                </div>
              )}

              {/* STEP 1 */}
              {step === 1 && (
                <div className="space-y-4">
                  {/* Subtitle */}
                  <p className="text-sm mb-2" style={{ color: primarycolor }}>
                    Explain your request
                  </p>

                  {/* Textarea */}
                  <textarea
                    value={draft.issue}
                    onChange={(e) =>
                      setDraft({ ...draft, issue: e.target.value })
                    }
                    placeholder="Briefly describe your problem (or record a voice message)..."
                    className="w-full min-h-35 rounded-lg px-4 py-3 text-sm bg-transparent resize-none focus:outline-none mb-1"
                    style={{
                      border: `1px solid ${borderColor}`,
                      backgroundColor:
                        `${primarycolor}2A` || "rgba(255,255,255,0.02)",
                      color: primarycolor,
                    }}
                  />
                  {/* OR */}
                  <div className="flex items-center gap-3">
                    <div
                      className="flex-1 h-px"
                      style={{ backgroundColor: borderColor }}
                    />
                    <span
                      className="text-xs uppercase"
                      style={{ color: primarycolor }}
                    >
                      or
                    </span>
                    <div
                      className="flex-1 h-px"
                      style={{ backgroundColor: borderColor }}
                    />
                  </div>

                  {/* Record button */}
                  {/* START RECORD */}
                  {!isRecording && !draft.audio && (
                    <button
                      onClick={startRecording}
                      className="w-full border py-3 rounded-lg text-sm font-medium cursor-pointer"
                      style={{
                        borderColor: borderColor,
                        color: primarycolor,
                      }}
                    >
                      Start Recording
                    </button>
                  )}

                  {/* RECORDING */}
                  {isRecording && (
                    <>
                      <div className="flex gap-3">
                        <button
                          onClick={stopRecording}
                          className="flex-1 py-3 rounded-lg text-sm font-medium cursor-pointer"
                          style={{
                            backgroundColor: primarycolor,
                            color: modalBgColor,
                          }}
                        >
                          ⏹ Stop Recording
                        </button>

                        <button
                          onClick={deleteRecording}
                          className="flex-1 py-3 rounded-lg text-sm font-medium text-white bg-red-600 cursor-pointer"
                        >
                          🗑 Delete
                        </button>
                      </div>

                      {/* RECORDING PROGRESS */}
                      <div className="space-y-1">
                        <div
                          className="h-1 rounded overflow-hidden"
                          style={{ backgroundColor: `${primarycolor}7A` }}
                        >
                          <div
                            className="h-full transition-[width] duration-200"
                            style={{
                              width: `${recordingPercent}%`,
                              backgroundColor: primarycolor,
                            }}
                          />
                        </div>
                        <div
                          className="flex justify-between text-xs"
                          style={{ color: primarycolor }}
                        >
                          <span>{formatTime(recordingElapsed)}</span>
                          <span>{formatTime(MAX_RECORDING_TIME)}</span>
                        </div>
                      </div>
                    </>
                  )}

                  {/* PLAYBACK */}
                  {draft.audio && audioUrl && (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={togglePlayAudio}
                          disabled={isPlaying}
                          className="flex-1 py-3 rounded-lg text-sm font-medium cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                          style={{
                            backgroundColor: primarycolor,
                            color: modalBgColor,
                          }}
                        >
                          {"▶ Play Recording"}
                        </button>
                        <button
                          onClick={togglePlayAudio}
                          disabled={!isPlaying}
                          className="flex-1 py-3 rounded-lg text-sm font-medium cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                          style={{
                            backgroundColor: primarycolor,
                            color: modalBgColor,
                          }}
                        >
                          {"⏸ Pause Recording"}
                        </button>

                        <button
                          onClick={deleteRecording}
                          className="flex-1 py-3 rounded-lg text-sm font-medium cursor-pointer text-white bg-red-600"
                        >
                          Delete Recording
                        </button>

                        <button
                          onClick={startRecording}
                          className="flex-1 py-3 rounded-lg text-sm font-medium cursor-pointer text-white bg-green-600"
                        >
                          Record Again
                        </button>
                      </div>

                      {/* PLAYBACK PROGRESS */}
                      <div className="space-y-1">
                        <div
                          className="h-1 rounded overflow-hidden"
                          style={{ backgroundColor: `${primarycolor}7A` }}
                        >
                          <div
                            className="h-full transition-[width] duration-200"
                            style={{
                              width: `${playPercent}%`,
                              backgroundColor: primarycolor,
                            }}
                          />
                        </div>
                        <div
                          className="flex justify-between text-xs"
                          style={{ color: primarycolor }}
                        >
                          <span>{formatTime(playProgress)}</span>
                          <span>{formatTime(recordedDuration)}</span>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Note */}
                  <p className="text-xs mb-6" style={{ color: primarycolor }}>
                    Note: You can submit your request using text (at least 20
                    characters) or audio (5–120 seconds).
                  </p>

                  {/* Forward */}
                  <div className="flex gap-2">
                    <button
                      onClick={handleBack}
                      className="border solid mt-2 mb-6 rounded-lg text-md px-5 cursor-pointer"
                      style={{
                        borderColor: borderColor,
                        color: primarycolor,
                      }}
                    >
                      Back
                    </button>
                    <button
                      disabled={!canContinue}
                      onClick={() => setStep(2)}
                      className="cursor-pointer w-full py-3 rounded-lg text-md font-bold hover:opacity-90 mt-2 mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        backgroundColor: primarycolor,
                        color: modalBgColor,
                      }}
                    >
                      Move Forward →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div className="space-y-6">
                  {/* Title */}
                  <p
                    className="text-sm font-base mb-3"
                    style={{ color: primarycolor }}
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
                          className="cursor-pointer py-4 rounded-lg text-sm font-medium transition"
                          style={{
                            border: `1px solid ${borderColor}`,
                            backgroundColor: selected
                              ? primarycolor
                              : "transparent",
                            color: selected ? modalBgColor : primarycolor,
                          }}
                        >
                          {c}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleBack}
                      className="border solid mb-5 rounded-lg text-md px-5 cursor-pointer"
                      style={{
                        borderColor: borderColor,
                        color: primarycolor,
                      }}
                    >
                      Back
                    </button>
                    <button
                      onClick={submitCallbackRequest}
                      disabled={!canSubmit}
                      className="cursor-pointer w-full py-3 rounded-lg text-md font-bold transition disabled:opacity-40 disabled:cursor-not-allowed mb-5"
                      style={{
                        backgroundColor: primarycolor,
                        color: modalBgColor,
                      }}
                    >
                      Submit Request →
                    </button>
                  </div>
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
  onPrimaryAction,
  primarycolor,
  modalBgColor,
}: {
  onClose: () => void;
  onPrimaryAction?: () => void;
  primarycolor: string;
  modalBgColor: string;
}) {
  return (
    <div
      className="px-5 sm:px-10 py-10 sm:py-12 flex flex-col space-y-6"
      style={{ color: primarycolor }}
    >
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

      <h1
        className="text-base text-left"
        style={{ color: primarycolor, opacity: 0.6 }}
      >
        Your callback request has been received. Our team will reach out to you
        at your selected time slot.
      </h1>

      <button
        onClick={onPrimaryAction}
        className="w-full py-3 rounded-lg text-sm font-bold text-center items-center hover:opacity-90 cursor-pointer"
        style={{ backgroundColor: primarycolor, color: modalBgColor }}
      >
        Go to the Website →
      </button>
    </div>
  );
}
