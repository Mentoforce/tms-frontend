import { getFileType } from "@/lib/filePreview";
import {
  IconFile,
  IconFileTypePdf,
  IconVideo,
  IconMusic,
  IconDownload,
} from "@tabler/icons-react";

type Props = {
  file: {
    _id: string;
    file_name: string;
    file_url: string;
  };
};

export default function FileCard({ file }: Props) {
  const type = getFileType(file.file_name);

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3 space-y-2">
      {/* PREVIEW */}
      {type === "image" && (
        <a href={file.file_url} target="_blank">
          <img
            src={file.file_url}
            alt={file.file_name}
            className="h-32 w-full object-cover rounded-lg"
          />
        </a>
      )}

      {type !== "image" && (
        <div className="h-32 flex items-center justify-center bg-black/40 rounded-lg">
          {type === "pdf" && (
            <IconFileTypePdf size={42} className="text-red-400" />
          )}
          {type === "video" && (
            <IconVideo size={42} className="text-purple-400" />
          )}
          {type === "audio" && (
            <IconMusic size={42} className="text-green-400" />
          )}
          {type === "other" && <IconFile size={40} className="text-white/60" />}
        </div>
      )}

      {/* FILE NAME */}
      <p className="text-sm text-white truncate" title={file.file_name}>
        {file.file_name}
      </p>

      {/* BADGE + ACTIONS */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wide text-white/50">
          {type}
        </span>

        <div className="flex items-center gap-3">
          <a
            href={file.file_url}
            target="_blank"
            className="text-xs text-white/60 hover:text-white"
          >
            View
          </a>

          <a
            href={file.file_url}
            download
            className="flex items-center gap-1 text-xs text-white/60 hover:text-white"
          >
            <IconDownload size={14} />
            Download
          </a>
        </div>
      </div>
    </div>
  );
}
