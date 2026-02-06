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
import { ThemeType } from "@/types/context-types";

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
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

export default function RaiseTicketModal({
  open,
  onClose,
  theme,
}: {
  open: boolean;
  onClose: () => void;
  theme?: ThemeType;
}) {
  const [step, setStep] = useState(0);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subSubjects, setSubSubjects] = useState<any[]>([]);
  const [successTicket, setSuccessTicket] = useState<string | null>(null);
  const [counter, setCounter] = useState(5);
  const [fileError, setFileError] = useState<string | null>(null);

  const [draft, setDraft] = useState({
    username: "",
    subject_id: "",
    sub_subject_id: "",
    description: "",
    audio: null as Blob | null,
    files: [] as {
      file: File;
      name: string;
      note: string;
    }[],
    return_channel: "email",
  });

  const { organisation } = useOrganisation();
  const router = useRouter();

  // Extract theme colors with fallbacks
  const primarycolor = theme?.primary_color || DEFAULT_PRIMARY;
  const baseColor = theme?.base_color || "#0A0A0A";
  const bgColor = theme?.bg_color || "transparent";
  const subColor = theme?.sub_color || "rgba(255,255,255,0.5)";
  const borderColor = theme?.border_color || primarycolor;
  const modalBgColor = theme?.modal_bg_color || "#0A0A0A";
  const accent = primarycolor;

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
        className="w-full flex flex-col max-w-md mx-auto text-left space-y-5 px-5 sm:px-10 py-5 sm:py-6"
        style={{ color: primarycolor }}
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
            border: `1px solid ${primarycolor}`,
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
          className="w-full py-3 mb-4 rounded-lg text-sm font-bold transition hover:opacity-90 cursor-pointer"
          style={{ backgroundColor: primarycolor, color: modalBgColor }}
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

    try {
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
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  /* ---------- STOP RECORDING ---------- */
  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.stop();
    }
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

  /* ---------------- File Validation ---------------- */
  const validateFiles = (
    files: File[],
  ): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    files.forEach((file) => {
      const maxSize = file.type.startsWith("video/")
        ? MAX_VIDEO_SIZE
        : MAX_FILE_SIZE;

      if (file.size > maxSize) {
        const maxSizeMB = maxSize / (1024 * 1024);
        const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
        errors.push(
          `${file.name}: ${fileSizeMB}MB exceeds ${maxSizeMB}MB limit`,
        );
      }
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  };

  /* ---------------- Handle File Upload ---------------- */
  const handleFileUpload = (selectedFiles: FileList | File[]) => {
    const filesArray = Array.from(selectedFiles);

    if (draft.files.length + filesArray.length > 4) {
      setFileError("Maximum 4 files allowed");
      return;
    }

    const validation = validateFiles(filesArray);

    if (!validation.valid) {
      setFileError(validation.errors.join(", "));
      return;
    }

    setFileError(null);

    const filesToAdd = filesArray.map((file) => ({
      file,
      name: file.name,
      note: "",
    }));

    setDraft({
      ...draft,
      files: [...draft.files, ...filesToAdd],
    });
  };

  /* ---------------- Submit ---------------- */
  const submitTicket = async () => {
    setIsSubmitting(true);

    try {
      console.log(
        "Submitting ticket with files:",
        draft.files.map((f) => ({
          name: f.name,
          size: f.file.size,
          note: f.note,
        })),
      );

      const fd = new FormData();

      fd.append("username", draft.username);
      fd.append("subject_id", draft.subject_id);
      fd.append("sub_subject_id", draft.sub_subject_id);
      fd.append("description", draft.description);
      fd.append("return_channel", draft.return_channel);

      // Append file notes as array
      draft.files.forEach((f) => {
        fd.append("file_notes[]", f.note || "");
      });

      // Append files
      draft.files.forEach((f) => {
        fd.append("files", f.file);
      });

      // Append audio if exists
      if (draft.audio) {
        // Validate audio size
        if (draft.audio.size > MAX_FILE_SIZE) {
          throw new Error("Audio file exceeds 10MB limit");
        }
        fd.append("audio", draft.audio);
      }

      // Debug: Log FormData entries
      console.log("FormData entries:");
      for (let pair of fd.entries()) {
        console.log(pair[0], pair[1]);
      }

      const res = await api.post("/tickets/create", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccessTicket(res.data.data.ticket_number);
    } catch (error: any) {
      console.error("Error submitting ticket:", error);

      // Show user-friendly error message
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to submit ticket. Please try again.";

      alert(`Error: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

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
    setFileError(null);
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
      setFileError(null);
      onClose();
    }
    router.push(organisation?.link || "/");
  };

  if (!open) return null;

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
              Request for Quick Support
            </h2>
            <button
              onClick={handleClose}
              className=" hover:opacity-70 text-xl sm:text-2xl pt-3 cursor-pointer"
              style={{ color: primarycolor }}
            >
              ✕
            </button>
          </div>

          {/* INSET DIVIDER */}
          <div
            className="sm:mt-5 mt-4 opacity-40"
            style={{
              borderBottom: `1px solid ${borderColor}`,
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
                style={{ color: primarycolor }}
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
                      border: `1px solid ${borderColor}`,
                      color: primarycolor,
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
                      style={{ border: `1px solid ${borderColor}` }}
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
                      style={{ color: primarycolor }}
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
                      style={{ border: `1px solid ${borderColor}` }}
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
                      style={{ color: primarycolor }}
                    >
                      ▾
                    </span>
                  </div>
                </div>

                {/* MOVE FORWARD */}
                <button
                  disabled={!canMoveForward}
                  onClick={() => setStep(1)}
                  className="w-full mt-4 py-3 rounded-lg text-base font-bold cursor-pointer transition disabled:opacity-40 disabled:cursor-not-allowed mb-4"
                  style={{ backgroundColor: primarycolor, color: modalBgColor }}
                >
                  Move Forward →
                </button>
              </div>
            )}

            {step === 1 && (
              <div
                className="px-5 sm:px-10 py-5 sm:py-6 space-y-5"
                style={{ color: primarycolor }}
              >
                <div
                  className="rounded-xl px-6 py-5 space-y-3"
                  style={{
                    border: `1px solid ${borderColor}`,
                    backgroundColor:
                      `${primarycolor}2A` || "rgba(255,255,255,0.1)",
                  }}
                >
                  {/* TITLE */}
                  <h3 className="text-sm font-base">
                    Information Regarding Your{" "}
                    {
                      subSubjects.find((s) => s._id === draft.sub_subject_id)
                        ?.title
                    }{" "}
                    Request
                  </h3>

                  {/* DESCRIPTION FROM BACKEND */}
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: theme?.sub_color || primarycolor }}
                  >
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
                  className="cursor-pointer w-full py-3 mb-4 rounded-lg text-base font-bold flex items-center justify-center gap-2 transition disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: primarycolor,
                    color: modalBgColor,
                  }}
                >
                  Continue →{counter > 0 && <span>({counter})</span>}
                </button>
              </div>
            )}

            {step === 2 && (
              <div
                className="px-5 sm:px-10 py-5 sm:py-6 space-y-5"
                style={{ color: primarycolor }}
              >
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
                    className="w-full min-h-40 rounded-lg px-4 py-3 text-sm placeholder:text-current/40 resize-none focus:outline-none"
                    style={{
                      border: `1px solid ${borderColor}`,
                      backgroundColor:
                        `${primarycolor}2A` || "rgba(255,255,255,0.02)",
                      lineHeight: "1.9",
                      color: primarycolor,
                    }}
                  />
                </div>

                {/* OR */}
                <div className="flex items-center gap-3">
                  <div
                    className="flex-1 h-px"
                    style={{ backgroundColor: borderColor }}
                  />
                  <span
                    className="text-xs uppercase"
                    style={{ color: subColor }}
                  >
                    or
                  </span>
                  <div
                    className="flex-1 h-px"
                    style={{ backgroundColor: borderColor }}
                  />
                </div>

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
                        className="flex-1 py-3 rounded-lg text-sm font-medium  cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
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
                        className="flex-1 py-3 rounded-lg text-sm font-medium  cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
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
                        onClick={() => {
                          deleteRecording();
                          startRecording();
                        }}
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
                            width: audioRef.current
                              ? `${
                                  (playProgress /
                                    (audioRef.current.duration || 1)) *
                                  100
                                }%`
                              : "0%",
                            backgroundColor: primarycolor,
                          }}
                        />
                      </div>
                      <div
                        className="flex justify-between text-xs"
                        style={{ color: primarycolor }}
                      >
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

                <p className="text-xs mb-6" style={{ color: primarycolor }}>
                  Note: You can submit your request using text (at least 20
                  characters) or audio (5–120 seconds).
                </p>

                {/* CONTINUE */}
                <button
                  disabled={!canContinue}
                  onClick={() => setStep(3)}
                  className="w-full py-3 mb-4 rounded-lg text-base font-bold cursor-pointer transition disabled:opacity-40 disabled:cursor-not-allowed "
                  style={{ backgroundColor: primarycolor, color: modalBgColor }}
                >
                  Continue →
                </button>
              </div>
            )}

            {/* STEP 3 - FILE UPLOAD */}
            {step === 3 && (
              <div
                className="px-5 sm:px-10 py-5 sm:py-6 space-y-5"
                style={{ color: primarycolor }}
              >
                {/* HEADER */}
                <div className="flex justify-between text-sm flex-col sm:flex-row ">
                  <span className="font-medium">
                    Additional Files{" "}
                    <span style={{ color: `${primarycolor}7A` }}>
                      (Optional)
                    </span>
                  </span>
                  <span style={{ color: primarycolor }}>
                    {draft.files.length}/4 files uploaded
                  </span>
                </div>

                {/* DROPZONE */}
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleFileUpload(e.dataTransfer.files);
                  }}
                  className="rounded-xl border border-dashed text-center py-10 transition cursor-pointer"
                  style={{
                    borderColor: fileError ? "#ef4444" : `${primarycolor}AA`,
                    backgroundColor: fileError
                      ? "rgba(239, 68, 68, 0.1)"
                      : "transparent",
                  }}
                >
                  <input
                    type="file"
                    multiple
                    disabled={draft.files.length >= 4}
                    className="hidden"
                    id="file-upload"
                    onChange={(e) => {
                      if (e.target.files) {
                        handleFileUpload(e.target.files);
                      }
                      e.target.value = ""; // Reset input
                    }}
                  />

                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                    style={{ color: primarycolor }}
                  >
                    <div className="text-xl">
                      <IconUpload size={18} stroke={2} />
                    </div>
                    <p className="text-sm">
                      Drag & drop files here or{" "}
                      <span className="underline">browse</span>
                    </p>
                    <p className="text-xs" style={{ color: primarycolor }}>
                      (PDF/Photo: 10MB • Video: 50MB)
                    </p>
                    {fileError && (
                      <p className="text-red-400 text-xs mt-2 max-w-xs">
                        {fileError}
                      </p>
                    )}
                  </label>
                </div>

                {/* FILE LIST WITH NOTES */}
                {draft.files.length > 0 && (
                  <div className="space-y-3">
                    {draft.files.map((f, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-lg px-3 py-3"
                        style={{ border: `1px solid ${borderColor}` }}
                      >
                        <div className="flex-1">
                          <div
                            className="text-sm"
                            style={{ color: primarycolor }}
                          >
                            {f.name.slice(0, 15)}
                            {f.name.length > 15 ? "..." : ""}
                          </div>
                          <div className="text-xs" style={{ color: subColor }}>
                            {(f.file.size / (1024 * 1024)).toFixed(2)} MB
                          </div>
                        </div>

                        <div className="flex gap-4 items-center">
                          <input
                            value={f.note}
                            maxLength={15}
                            placeholder="Note (optional, max 15 chars)"
                            onChange={(e) => {
                              const updated = [...draft.files];
                              updated[idx] = {
                                ...updated[idx],
                                note: e.target.value,
                              };
                              setDraft({ ...draft, files: updated });
                            }}
                            className="rounded px-3 py-1.5 text-xs bg-transparent focus:outline-none"
                            style={{
                              border: `1px solid ${borderColor}`,
                              color: subColor,
                              opacity: 0.8,
                            }}
                          />

                          <button
                            onClick={() => {
                              setDraft({
                                ...draft,
                                files: draft.files.filter((_, i) => i !== idx),
                              });
                              setFileError(null);
                            }}
                            className="text-red-600 text-xs hover:text-red-300 whitespace-nowrap"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* CONTINUE */}
                <button
                  onClick={() => {
                    setFileError(null);
                    setStep(step + 1);
                  }}
                  className="cursor-pointer w-full mt-2 mb-4 py-3 rounded-lg text-base font-bold"
                  style={{ backgroundColor: primarycolor, color: modalBgColor }}
                >
                  Continue →
                </button>
              </div>
            )}

            {step === 4 && (
              <div
                className="px-5 sm:px-10 py-5 sm:py-6 space-y-5"
                style={{ color: primarycolor }}
              >
                {/* TITLE */}
                <div>
                  <h3 className="text-sm font-base">Return Channel</h3>
                  <p className="text-sm mt-2" style={{ color: primarycolor }}>
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
                          border: `1px solid ${borderColor}`,
                          opacity: isSelected ? 1 : 0.5,
                          background: isSelected
                            ? "rgba(0,0,0,0.2)"
                            : "transparent",
                          color: primarycolor,
                        }}
                      >
                        <Icon size={18} stroke={1.5} />
                        <span className="font-medium">{label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* CONTINUE */}
                <button
                  disabled={!draft.return_channel}
                  onClick={() => setStep(step + 1)}
                  className="w-full mt-4 mb-4 py-3 rounded-lg text-base font-bold transition"
                  style={{
                    backgroundColor: draft.return_channel
                      ? primarycolor
                      : "rgba(255,255,255,0.2)",
                    color: draft.return_channel ? modalBgColor : "",
                    cursor: draft.return_channel ? "pointer" : "not-allowed",
                  }}
                >
                  Continue →
                </button>
              </div>
            )}

            {step === 5 && (
              <div
                className="px-5 sm:px-10 py-5 sm:py-6 space-y-5 text-sm"
                style={{ color: primarycolor }}
              >
                {/* TITLE */}
                <h3 className="text-base font-medium">Request Summary</h3>

                {/* SUMMARY */}
                <div className="space-y-2">
                  <div className="grid grid-cols-2">
                    <span style={{ color: `${primarycolor}AA` }}>
                      Username:
                    </span>
                    <span>{draft.username}</span>
                  </div>

                  <div className="grid grid-cols-2">
                    <span style={{ color: `${primarycolor}AA` }}>Subject:</span>
                    <span>
                      {subjects.find((s) => s._id === draft.subject_id)?.title}
                    </span>
                  </div>

                  <div className="grid grid-cols-2">
                    <span style={{ color: `${primarycolor}AA` }}>
                      Request Details:
                    </span>
                    <span className=" whitespace-pre-line">
                      {draft.description || "-"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2">
                    <span style={{ color: `${primarycolor}AA` }}>
                      Number of Attached Files:
                    </span>
                    <span>{draft.files.length}</span>
                  </div>

                  <div className="grid grid-cols-2">
                    <span style={{ color: `${primarycolor}AA` }}>
                      Return Channel:
                    </span>
                    <span className="capitalize ">{draft.return_channel}</span>
                  </div>
                </div>

                {/* DIVIDER */}
                <div
                  className="h-px"
                  style={{ backgroundColor: borderColor }}
                />

                <button
                  onClick={submitTicket}
                  disabled={isSubmitting}
                  className={`w-full mt-4 mb-4 py-4 rounded-lg text-base font-bold transition ${
                    isSubmitting
                      ? "opacity-60 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                  style={{ backgroundColor: primarycolor, color: modalBgColor }}
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
