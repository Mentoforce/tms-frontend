"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

const DEFAULT_PRIMARY = "#DFD1A1";

export default function Footer({ primarycolor }: { primarycolor?: string }) {
  const accent = primarycolor || DEFAULT_PRIMARY;
  const [footer, setFooter] = useState<any>(null);

  useEffect(() => {
    api.get("/footer").then((res) => setFooter(res.data.data));
  }, []);

  if (!footer) return null;

  return (
    <footer className="w-full mt-24">
      <div
        className="w-full max-w-360 mx-auto h-px"
        style={{ backgroundColor: `${accent}66` }}
      />

      <div className="w-full max-w-360 mx-auto py-10 px-4 text-center text-sm text-[#BDBDBD]">
        <div dangerouslySetInnerHTML={{ __html: footer.html_content }} />
      </div>
    </footer>
  );
}
