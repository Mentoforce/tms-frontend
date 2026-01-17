export const getFileType = (fileName: string) => {
  const ext = fileName.split(".").pop()?.toLowerCase();

  if (!ext) return "other";

  if (["jpg", "jpeg", "png", "webp", "gif"].includes(ext)) return "image";
  if (["pdf"].includes(ext)) return "pdf";
  if (["mp4", "mov", "webm", "mkv"].includes(ext)) return "video";
  if (["mp3", "wav", "ogg", "webm"].includes(ext)) return "audio";

  return "other";
};
