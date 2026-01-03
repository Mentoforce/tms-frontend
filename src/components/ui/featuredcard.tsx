// "use client";

// import Link from "next/link";

// interface FeatureCardProps {
//   icon: React.ReactNode;
//   title: string;
//   description: string;
//   href: string;
//   bgColor: string;
// }

// export default function FeatureCard({
//   icon,
//   title,
//   description,
//   href,
//   bgColor,
// }: FeatureCardProps) {
//   return (
//     <Link href={href}>
//       <div
//         className="flex h-[180px] cursor-pointer flex-col items-center justify-center text-center transition-transform hover:scale-[1.02]"
//         style={{
//           borderRadius: "16px",
//           backgroundColor: bgColor,
//           opacity: 0.85, // 🔒 fixed
//           border: "1px solid rgba(173,158,112,0.15)",
//           boxShadow: "0 0 40px rgba(173,158,112,0.08)",
//         }}
//       >
//         <div className="mb-4 text-[#AD9E70]">{icon}</div>

//         <h3 className="text-sm font-semibold tracking-wide text-white">
//           {title}
//         </h3>

//         <p className="mt-2 text-xs text-[#9B9B9B] max-w-[220px]">
//           {description}
//         </p>
//       </div>
//     </Link>
//   );
// }

"use client";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;

  // admin-driven
  bgColor?: string;
}

export default function FeatureCard({
  icon,
  title,
  description,
  bgColor = "#1A160C", // fallback
}: FeatureCardProps) {
  return (
    <div
      className="flex flex-col items-center justify-center text-center"
      style={{
        height: "180px",
        borderRadius: "16px",

        /* 🔑 ADMIN CONTROLS COLOR, OPACITY FIXED */
        backgroundColor: bgColor,
        opacity: 0.85,

        border: "1px solid rgba(173,158,112,0.15)",
        boxShadow: "0 0 40px rgba(173,158,112,0.08)",
      }}
    >
      <div className="mb-4 text-[#AD9E70]">{icon}</div>

      <h3 className="text-sm font-semibold tracking-wide text-white">
        {title}
      </h3>

      <p className="mt-2 text-xs text-[#9B9B9B] max-w-55">{description}</p>
    </div>
  );
}
