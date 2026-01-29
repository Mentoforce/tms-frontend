"use client";

import { useEffect, useRef, useState } from "react";
import { IconCopy, IconCheck, IconUpload } from "@tabler/icons-react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useOrganisation } from "@/context/OrganisationProvider";
import {
  IconBrandWhatsapp,
  IconMail,
  IconPhone,
  IconBrandTelegram,
} from "@tabler/icons-react";

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
const DEFAULT_PRIMARY = "#DFD1A1";

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

  const { organisation } = useOrganisation();
  const router = useRouter();

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

  /* ================= SUCCESS ================= */

  function SuccessScreen({
    ticket,
    onPrimaryAction,
  }: {
    ticket: string;
    onPrimaryAction: () => void;
  }) {
    const [copied, setCopied] = useState(false);

    const copyTicket = async () => {
      await navigator.clipboard.writeText(ticket);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    };

    return (
      <div
        className="w-full flex flex-col max-w-md mx-auto text-left space-y-5 px-6 sm:px-3 py-5 sm:py-6"
        style={{ color: "var(--accent)" }}
      >
        <p className="text-sm mb-3 font-medium">
          Your request has been received.
        </p>

        <p className="text-sm text-current/60 leading-relaxed">
          Your request will be reviewed and resolved as soon as possible. Please
          keep your Request ID until the process is complete.
        </p>

        <div
          className="flex items-center justify-center gap-3 rounded-lg px-4 py-3"
          style={{
            backgroundColor: `${primarycolor}33`,
            border: "1px solid var(--accent)",
          }}
        >
          <span className="font-mono font-bold text-base">{ticket}</span>

          <button
            onClick={copyTicket}
            className="text-current/80 hover:text-current transition"
            aria-label="Copy ticket ID"
          >
            {copied ? (
              <IconCheck size={18} stroke={2} />
            ) : (
              <IconCopy size={18} stroke={2} />
            )}
          </button>
        </div>

        <button
          onClick={onPrimaryAction}
          className="w-full py-3 mb-4 rounded-lg text-sm font-bold text-black transition hover:opacity-90 cursor-pointer"
          style={{ backgroundColor: "var(--accent)" }}
        >
          Go to the Website →
        </button>
      </div>
    );
  }

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // time formatter
  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  /* ---------- START RECORDING ---------- */
  const startRecording = async () => {
    // Prevent multiple recordings
    if (isRecording) return;

    // Clear previous interval if any
    if (recordingInterval.current) {
      clearInterval(recordingInterval.current);
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    const chunks: BlobPart[] = [];

    recorder.ondataavailable = (e) => chunks.push(e.data);

    recorder.onstop = () => {
      const audioBlob = new Blob(chunks, { type: "audio/webm" });

      setDraft((d) => ({ ...d, audio: audioBlob }));
      setAudioUrl(URL.createObjectURL(audioBlob));
      setRecordedDuration(recordingElapsed);

      setIsRecording(false);
      setRecordingElapsed(0);

      stream.getTracks().forEach((t) => t.stop());
      if (recordingInterval.current) clearInterval(recordingInterval.current);
      recordingInterval.current = null;
    };

    recorder.start();
    mediaRecorder.current = recorder;

    setIsRecording(true);
    setRecordingElapsed(0);

    // Start interval
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
    if (!audioUrl || !audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  /* ---------- PROGRESS ---------- */
  const recordingPercent = (recordingElapsed / MAX_RECORDING_TIME) * 100;
  const playPercent =
    recordedDuration > 0 ? (playProgress / recordedDuration) * 100 : 0;

  /* ---------- CONTINUE ---------- */
  const isTextValid =
    draft.description.trim().length -
      subSubjects.find((s) => s._id === draft.sub_subject_id)?.predefined_text
        ?.length >=
    20;
  const isAudioValid = !!draft.audio;
  const canContinue = isTextValid || isAudioValid;

  /* ---------------- Submit ---------------- */
  const submitTicket = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const fd = new FormData();
      fd.append("username", draft.username);
      fd.append("subject_id", draft.subject_id);
      fd.append("sub_subject_id", draft.sub_subject_id);
      fd.append("description", draft.description);
      fd.append("return_channel", draft.return_channel);

      if (draft.audio) fd.append("audio", draft.audio);
      draft.files.forEach((f) => fd.append("files", f.file, f.name));

      const res = await api.post("/tickets/create", fd);
      setSuccessTicket(res.data.data.ticket_number);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  /* ---------------- Validation ---------------- */

  const usernameRegex = /^[a-zA-Z0-9]{4,}$/;
  const isUsernameValid = usernameRegex.test(draft.username);

  const canMoveForward =
    draft.username.trim() !== "" &&
    isUsernameValid &&
    draft.subject_id !== "" &&
    draft.sub_subject_id !== "";

  const handleClose = () => {
    setStep(0);
    setDraft({
      username: "",
      subject_id: "",
      sub_subject_id: "",
      description: "",
      audio: null,
      files: [],
      return_channel: "email",
    });
    setSuccessTicket(null);
    setCounter(5);
    onClose();
  };

  const primaryAction = () => {
    if (!organisation?.link || organisation?.link == "/") {
      setStep(0);
      setDraft({
        username: "",
        subject_id: "",
        sub_subject_id: "",
        description: "",
        audio: null,
        files: [],
        return_channel: "email",
      });
      setSuccessTicket(null);
      setCounter(5);
      onClose();
    }
    router.push(organisation?.link || "/");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 sm:px-6"
      style={{ color: `${accent}`, ["--accent" as any]: accent }}
    >
      <div
        className="w-full max-w-130 rounded-2xl bg-[#0A0A0A] shadow-[0_0_60px_rgba(0,0,0,0.9)]"
        style={{ border: "1px solid var(--accent)" }}
      >
        {/* HEADER */}
        <div className="px-5 sm:px-10 pt-6 sm:pt-8 pb-1">
          <div className="flex items-center justify-between">
            <h2 className="font-medium text-xl sm:text-2xl pt-3">
              Request for Quick Support
            </h2>
            <button
              onClick={handleClose}
              className=" hover:opacity-70 text-xl sm:text-2xl pt-3 cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* INSET DIVIDER */}
          <div
            className="sm:mt-5 mt-4 opacity-40"
            style={{
              borderBottom: "1px solid",
              marginInline: "4px",
            }}
          />
        </div>

        {successTicket ? (
          <SuccessScreen
            ticket={successTicket}
            onPrimaryAction={primaryAction}
          />
        ) : (
          <>
            {/* STEP 0 – BASIC INFO */}
            {step === 0 && (
              <div
                className="px-5 sm:px-10 py-5 sm:py-6 space-y-5"
                style={{ color: `${accent}` }}
              >
                <div>
                  <label className="block text-sm  mb-2">Your Username</label>

                  <input
                    value={draft.username}
                    onChange={(e) =>
                      setDraft({ ...draft, username: e.target.value })
                    }
                    placeholder="Enter your username"
                    className="w-full mb-1 rounded-lg px-4 py-4 text-sm bg-transparent focus:outline-none placeholder:text-base"
                    style={{
                      border: `1px solid`,
                      color: accent,
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
                  <label className="block text-sm mb-2">Main Topic</label>

                  <div className="relative">
                    <select
                      value={draft.subject_id}
                      onChange={(e) => {
                        const subject = subjects.find(
                          (s) => s._id === e.target.value,
                        );
                        setSubSubjects(subject?.sub_subjects || []);
                        setDraft({
                          ...draft,
                          subject_id: e.target.value,
                          sub_subject_id: "",
                        });
                      }}
                      className="select-clean mb-1 w-full rounded-lg px-4 py-4 pr-12 text-sm bg-transparent focus:outline-none"
                      style={{ border: "1px solid " }}
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
                      style={{ color: `${accent}` }}
                    >
                      ▾
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2">Sub Topic</label>

                  <div className="relative">
                    <select
                      disabled={!draft.subject_id}
                      value={draft.sub_subject_id}
                      onChange={(e) => {
                        const ss = subSubjects.find(
                          (x) => x._id === e.target.value,
                        );
                        setDraft({
                          ...draft,
                          sub_subject_id: e.target.value,
                          description: ss?.predefined_text || "",
                        });
                      }}
                      className="select-clean w-full rounded-lg px-4 py-4 pr-12 text-sm bg-transparent disabled:opacity-50 focus:outline-none"
                      style={{ border: "1px solid " }}
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
                      style={{ color: `${accent}` }}
                    >
                      ▾
                    </span>
                  </div>
                </div>

                {/* MOVE FORWARD */}
                <button
                  disabled={!canMoveForward}
                  onClick={() => setStep(1)}
                  className="w-full mt-4 py-3 rounded-lg text-base font-bold text-black cursor-pointer transition disabled:opacity-40 disabled:cursor-not-allowed mb-4"
                  style={{ backgroundColor: "var(--accent)" }}
                >
                  Move Forward →
                </button>
              </div>
            )}

            {step === 1 && (
              <div className="px-5 sm:px-10 py-5 sm:py-6 space-y-9">
                <div className="rounded-xl border border-current/30 bg-white/2 px-6 py-5 space-y-3">
                  {/* TITLE */}
                  <h3
                    className="text-sm font-base"
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
                  <p className="text-sm leading-relaxed opacity-60">
                    {
                      subSubjects.find((s) => s._id === draft.sub_subject_id)
                        ?.information
                    }
                  </p>
                </div>

                {/* CONTINUE BUTTON */}
                <button
                  disabled={counter > 0}
                  onClick={() => setStep(2)}
                  className="cursor-pointer w-full py-3 mb-4 rounded-lg text-base font-bold text-black flex items-center justify-center gap-2 transition disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: "var(--accent)",
                  }}
                >
                  Continue →{counter > 0 && <span>({counter})</span>}
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="px-5 sm:px-10 py-5 sm:py-6 space-y-5">
                {/* DESCRIPTION */}
                <div>
                  <label className="block text-sm mb-2">
                    Describe Your Issue
                  </label>
                  <textarea
                    value={draft.description}
                    onChange={(e) =>
                      setDraft({ ...draft, description: e.target.value })
                    }
                    placeholder="Write your message here..."
                    className="w-full min-h-40 rounded-lg px-4 py-3 text-sm bg-white/2 placeholder:text-current/40 resize-none focus:outline-none"
                    style={{
                      border: "1px solid var(--accent)",
                      lineHeight: "1.9",
                    }}
                  />
                </div>

                {/* OR */}
                <div className="flex items-center gap-3">
                  <div
                    className="flex-1 h-px"
                    style={{ backgroundColor: "var(--accent)" }}
                  />
                  <span className="text-xs text-current/60 uppercase">or</span>
                  <div
                    className="flex-1 h-px"
                    style={{ backgroundColor: "var(--accent)" }}
                  />
                </div>

                {/* START RECORD */}
                {!isRecording && !draft.audio && (
                  <button
                    onClick={startRecording}
                    className="w-full border py-3 rounded-lg text-sm font-medium text-black cursor-pointer"
                    style={{
                      color: "var(--accent)",
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
                        className="flex-1 py-3 rounded-lg text-sm font-medium text-black cursor-pointer"
                        style={{ backgroundColor: "var(--accent)" }}
                      >
                        ⏹ Stop Recording
                      </button>

                      <button
                        onClick={deleteRecording}
                        className="flex-1 py-3 rounded-lg text-sm font-medium text-white bg-red-500 cursor-pointer"
                      >
                        🗑 Delete
                      </button>
                    </div>

                    {/* RECORDING PROGRESS */}
                    <div className="space-y-1">
                      <div className="h-1 bg-current/30 rounded overflow-hidden">
                        <div
                          className="h-full transition-[width] duration-200"
                          style={{
                            width: `${recordingPercent}%`,
                            backgroundColor: "var(--accent)",
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-current/60">
                        <span>{formatTime(recordingElapsed)}</span>
                        <span>{formatTime(MAX_RECORDING_TIME)}</span>
                      </div>
                    </div>
                  </>
                )}

                {/* PLAYBACK */}
                {draft.audio && audioUrl && (
                  <>
                    <audio
                      ref={audioRef}
                      src={audioUrl}
                      onTimeUpdate={() => {
                        if (!audioRef.current) return;
                        setPlayProgress(audioRef.current.currentTime);
                      }}
                      onEnded={() => {
                        setIsPlaying(false);
                        setPlayProgress(0);
                      }}
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={togglePlayAudio}
                        disabled={isPlaying}
                        className="flex-1 py-3 rounded-lg text-sm font-medium text-black cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ backgroundColor: accent }}
                      >
                        {"▶ Play Recording"}
                      </button>
                      <button
                        onClick={togglePlayAudio}
                        disabled={!isPlaying}
                        className="flex-1 py-3 rounded-lg text-sm font-medium text-black cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ backgroundColor: accent }}
                      >
                        {"⏸ Pause Recording"}
                      </button>

                      <button
                        onClick={deleteRecording}
                        className="flex-1 py-3 rounded-lg text-sm font-medium cursor-pointer text-white bg-red-500"
                      >
                        Delete Recording
                      </button>

                      <button
                        onClick={deleteRecording}
                        className="flex-1 py-3 rounded-lg text-sm font-medium cursor-pointer text-white bg-green-600"
                      >
                        Record Again
                      </button>
                    </div>

                    {/* PLAYBACK PROGRESS */}
                    <div className="space-y-1">
                      <div className="h-1 bg-current/30 rounded overflow-hidden">
                        <div
                          className="h-full transition-[width] duration-200"
                          style={{
                            width: audioRef.current
                              ? `${
                                  (playProgress /
                                    (audioRef.current.duration || 1)) *
                                  100
                                }%`
                              : "0%",
                            backgroundColor: accent,
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-current/60">
                        <span>{formatTime(playProgress)}</span>
                        <span>
                          {audioRef.current
                            ? formatTime(audioRef.current.duration)
                            : "0:00"}
                        </span>
                      </div>
                    </div>
                  </>
                )}

                <p className="text-xs text-current/50 mb-6">
                  Note: You can submit your request using text (at least 20
                  characters) or audio (5–120 seconds).
                </p>

                {/* CONTINUE */}
                <button
                  disabled={!canContinue}
                  onClick={() => setStep(3)}
                  className="w-full py-3 mt-4 mb-4 rounded-lg text-base font-bold text-black cursor-pointer transition disabled:opacity-40 disabled:cursor-not-allowed "
                  style={{ backgroundColor: "var(--accent)" }}
                >
                  Continue →
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="px-5 sm:px-10 py-5 sm:py-6 space-y-5">
                {/* HEADER */}
                <div className="flex justify-between text-sm flex-col sm:flex-row ">
                  <span className="font-medium text-(--accent)">
                    Additional Files{" "}
                    <span className="text-current/50">(Optional)</span>
                  </span>
                  <span className="text-current/50">
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
                  style={{ borderColor: "var(--accent)" }}
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
                    className="cursor-pointer flex flex-col items-center gap-2 text-current/70"
                  >
                    <div className="text-xl">
                      <IconUpload size={18} stroke={2} />
                    </div>
                    <p className="text-sm">
                      Drag & drop files here or{" "}
                      <span className="underline">browse</span>
                    </p>
                    <p className="text-xs text-current/40">
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
                          className="flex-1 bg-transparent text-sm focus:outline-none"
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
                  className="cursor-pointer w-full mt-4 mb-4 py-3 rounded-lg  text-base font-bold text-black"
                  style={{ backgroundColor: "var(--accent)" }}
                >
                  Continue →
                </button>
              </div>
            )}

            {step === 4 && (
              <div className="px-5 sm:px-10 py-5 sm:py-6 space-y-5">
                {/* TITLE */}
                <div>
                  <h3 className="text-sm font-base">Return Channel</h3>
                  <p className="text-sm text-current/50 mt-2">
                    Choose the channel through which you will receive feedback
                    regarding your request.
                  </p>
                </div>

                {/* OPTIONS */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Email", value: "email", Icon: IconMail },
                    { label: "Telephone", value: "telephone", Icon: IconPhone },
                    {
                      label: "Whatsapp",
                      value: "whatsapp",
                      Icon: IconBrandWhatsapp,
                    },
                    {
                      label: "Telegram",
                      value: "telegram",
                      Icon: IconBrandTelegram,
                    },
                  ].map(({ label, value, Icon }) => {
                    const isSelected = draft.return_channel === value;

                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() =>
                          setDraft({ ...draft, return_channel: value })
                        }
                        className="flex items-center gap-3 px-5 py-4 rounded-xl text-sm transition"
                        style={{
                          border: `1px solid currentColor`,
                          opacity: isSelected ? 1 : 0.5,
                          background: isSelected
                            ? "rgba(0,0,0,0.2)"
                            : "transparent",
                        }}
                      >
                        <Icon size={18} stroke={1.5} />
                        <span className="font-medium">{label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* CONTINUE — untouched */}
                <button
                  disabled={!draft.return_channel}
                  onClick={() => setStep(step + 1)}
                  className="cursor-pointer w-full mt-4 mb-4 py-3 rounded-lg text-base font-bold transition"
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
              <div className="px-5 sm:px-10 py-5 sm:py-6 space-y-5 text-sm">
                {/* TITLE */}
                <h3
                  className="text-base font-medium"
                  style={{ color: "var(--accent)" }}
                >
                  Request Summary
                </h3>

                {/* SUMMARY */}
                <div className="space-y-2 text-current/70">
                  <div className="grid grid-cols-2">
                    <span className="w-44 text-current/50">Username:</span>
                    <span>{draft.username}</span>
                  </div>

                  <div className="grid grid-cols-2">
                    <span className="w-44 text-current/50">Subject:</span>
                    <span>
                      {subjects.find((s) => s._id === draft.subject_id)?.title}{" "}
                      ›{" "}
                      {
                        subSubjects.find((s) => s._id === draft.sub_subject_id)
                          ?.title
                      }
                    </span>
                  </div>

                  <div className="grid grid-cols-2">
                    <span className="w-44 text-current/50">
                      Request Details:
                    </span>
                    <span className=" whitespace-pre-line">
                      {draft.description || "-"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2">
                    <span className="w-44 text-current/50">
                      Number of Attached Files:
                    </span>
                    <span>{draft.files.length}</span>
                  </div>

                  <div className="grid grid-cols-2">
                    <span className="w-44 text-current/50">
                      Return Channel:
                    </span>
                    <span className="capitalize ">{draft.return_channel}</span>
                  </div>
                </div>

                {/* DIVIDER */}
                <div className="h-px bg-current/10" />

                <button
                  onClick={submitTicket}
                  disabled={isSubmitting}
                  className={`w-full mt-4 mb-4 py-4 rounded-lg text-base font-bold text-black transition ${
                    isSubmitting
                      ? "opacity-60 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                  style={{ backgroundColor: "var(--accent)" }}
                >
                  {isSubmitting ? "Sending..." : "Send →"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
