// "use client";

// import { useEffect, useState } from "react";
// import api from "@/lib/axios";

// const DEFAULT_PRIMARY = "#DFD1A1";

// export default function Footer({ primarycolor }: { primarycolor?: string }) {
//   const accent = primarycolor || DEFAULT_PRIMARY;
//   const [footer, setFooter] = useState<any>(null);

//   useEffect(() => {
//     api.get("/footer").then((res) => setFooter(res.data.data));
//   }, []);

//   if (!footer) return null;

//   return (
//     <footer className="w-full sm:mt-24 mt-12">
//       <div
//         aria-hidden
//         className="h-px w-[90%] mx-auto"
//         style={{ backgroundColor: accent }}
//       />

//       <div className="w-full max-w-360 mx-auto py-10 px-4 text-center text-sm text-[#BDBDBD]">
//         <div dangerouslySetInnerHTML={{ __html: footer.html_content }} />
//       </div>
//     </footer>
//   );
// }

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
    <footer className="w-full mt-15 pb-10">
      <div
        aria-hidden
        className="
          w-full
          max-w-82 md:max-w-210
          mx-auto
          h-px md:h-[0.5px]
          opacity-20
        "
        style={{ backgroundColor: accent }}
      />

      {/* FOOTER CONTENT */}
      <div
        className="
          w-full
          max-w-82 md:max-w-210
          mx-auto
          pt-8
          text-center
          text-[12px] md:text-[14px]
          font-light
          leading-relaxed
          tracking-wide
        "
        style={{ ["--footer-accent" as any]: accent }}
      >
        <div
          className="opacity-60 footer-html"
          dangerouslySetInnerHTML={{ __html: footer.html_content }}
        />
      </div>
    </footer>
  );
}
