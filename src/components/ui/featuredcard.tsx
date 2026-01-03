"use client";

import { iconMapper } from "@/lib/iconMapper";

const CARD_BG_OPACITY = 0.14; // 🔒 constant

interface FeatureCardProps {
  title: string;
  subtitle: string;
  icon: string;
  bgColor: string;
  onClick: () => void;
}

export default function FeatureCard({
  title,
  subtitle,
  icon,
  bgColor,
  onClick,
}: FeatureCardProps) {
  const Icon = iconMapper[icon] ?? iconMapper.default;

  return (
    <button
      onClick={onClick}
      className="relative rounded-xl p-6 text-left transition hover:scale-[1.02]"
      style={{
        backgroundColor: bgColor,
        opacity: CARD_BG_OPACITY,
      }}
    >
      <div className="relative z-10 opacity-100">
        <Icon className="w-7 h-7 mb-4 text-white" />
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-sm text-white/80 mt-1">{subtitle}</p>
      </div>
    </button>
  );
}

// "use client";

// interface FeatureCardProps {
//   icon: React.ReactNode;
//   title: string;
//   description: string;

//   // admin-driven
//   bgColor?: string;
// }

// export default function FeatureCard({
//   icon,
//   title,
//   description,
//   bgColor = "#1A160C", // fallback
// }: FeatureCardProps) {
//   return (
//     <div
//       className="flex flex-col items-center justify-center text-center"
//       style={{
//         height: "180px",
//         borderRadius: "16px",

//         /* 🔑 ADMIN CONTROLS COLOR, OPACITY FIXED */
//         backgroundColor: bgColor,
//         opacity: 0.85,

//         border: "1px solid rgba(173,158,112,0.15)",
//         boxShadow: "0 0 40px rgba(173,158,112,0.08)",
//       }}
//     >
//       <div className="mb-4 text-[#AD9E70]">{icon}</div>

//       <h3 className="text-sm font-semibold tracking-wide text-white">
//         {title}
//       </h3>

//       <p className="mt-2 text-xs text-[#9B9B9B] max-w-55">{description}</p>
//     </div>
//   );
// }
