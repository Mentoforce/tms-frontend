"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

const DEFAULT_PRIMARY = "#DFD1A1";

export default function Footer({ primarycolor }: { primarycolor?: string }) {
  const accent = primarycolor || DEFAULT_PRIMARY;

  const [text, setText] = useState("All rights are reserved");
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const res = await api.get("/footer");
        if (res.data?.data) {
          setText(res.data.data.text);
          setYear(res.data.data.year);
        }
      } catch (err) {
        // silent fail → fallback text/year already set
      }
    };

    fetchFooter();
  }, []);

  return (
    <footer className="w-full mt-24">
      <div
        className="w-full max-w-360 mx-auto h-px"
        style={{ backgroundColor: `${accent}66` }}
      />

      <div className="w-full max-w-360 mx-auto flex items-center justify-center py-10 px-4">
        <p className="text-sm text-[#BDBDBD] text-center">
          {text} <span className="text-white">@{year}</span>
        </p>
      </div>
    </footer>
  );
}

// "use client";
// const DEFAULT_PRIMARY = "#DFD1A1";
// export default function Footer({ primarycolor }: { primarycolor?: string }) {
//   const accent = primarycolor || DEFAULT_PRIMARY;
//   return (
//     <footer className="w-full mt-24">
//       <div
//         className="w-full max-w-360 mx-auto h-px"
//         style={{ backgroundColor: `${accent}66` }}
//       />
//       <div className="w-full max-w-360 mx-auto flex items-center justify-center py-10 px-4">
//         <p className="text-sm text-[#BDBDBD] text-center">
//           All rights are reserved <span className="text-white">@2026</span>
//         </p>
//       </div>
//     </footer>
//   );
// }
