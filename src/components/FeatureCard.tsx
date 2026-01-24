import {
  IconTicket,
  IconPhoneCall,
  IconBrandWhatsapp,
  IconBrandTelegram,
  IconMail,
  IconUpload,
  IconGift,
  IconWorldWww,
  IconUser,
} from "@tabler/icons-react";

const ICON_MAP: any = {
  IconTicket,
  IconPhoneCall,
  IconBrandWhatsapp,
  IconBrandTelegram,
  IconMail,
  IconUpload,
  IconGift,
  IconWorldWww,
  IconUser,
};
export default function FeatureCard({
  icon,
  title,
  subtitle,
  onClick,
  primarycolor,
  quick_access,
}: {
  icon: string;
  title: string;
  subtitle: string;
  onClick: () => void;
  primarycolor: string;
  quick_access: boolean;
}) {
  const Icon = ICON_MAP[icon] || IconTicket;
  const iconSizeClass = quick_access
    ? "w-[46px] h-[46px] sm:w-[56px] sm:h-[56px]"
    : "w-[60px] h-[60px] sm:w-[60px] sm:h-[60px]";
  return (
    <button
      onClick={onClick}
      className={`${
        quick_access ? "sm:h-73.25" : "sm:h-70"
      } h-52 cursor-pointer w-full sm:rounded-4xl rounded-2xl flex flex-col items-center justify-center text-center gap-1 transition hover:scale-[1.02] active:scale-[0.99] `}
      style={{
        backgroundColor: `${primarycolor}1A`,
        boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
      }}
    >
      {/* ICON */}
      <div className="relative flex items-center justify-center w-14.5 h-14.5 mb-2">
        {quick_access && (
          <div
            className="absolute rounded-full sm:w-11.25 w-[31.42px] sm:h-11.25 h-[32.36px]"
            style={{
              backgroundColor: primarycolor,
              opacity: 0.15,
              top: "20px",
              left: "23px",
            }}
          />
        )}

        {/* Icon sits relative and z-10 to stay above the circle */}
        <div className="relative z-10 text-[#BDBDBD]">
          <Icon className={iconSizeClass} stroke={0.8} />
        </div>
      </div>

      {/* TITLE */}
      <h3
        className={`${
          quick_access
            ? "sm:text-[28px] text-[20px]"
            : "sm:text-[18px] text-[18.01px]"
        } mt-1 font-semibold text-[#FFFFFF]`}
      >
        {title}
      </h3>

      {/* SUBTITLE */}
      <p className="text-[14px] text-[#BDBDBD] px-2 text-center mx-auto leading-relaxed">
        {subtitle}
      </p>
    </button>
  );
}

// import {
//   IconTicket,
//   IconPhoneCall,
//   IconBrandWhatsapp,
//   IconBrandTelegram,
//   IconMail,
//   IconUpload,
//   IconGift,
//   IconWorldWww,
//   IconUser,
// } from "@tabler/icons-react";

// const ICON_MAP: any = {
//   IconTicket,
//   IconPhoneCall,
//   IconBrandWhatsapp,
//   IconBrandTelegram,
//   IconMail,
//   IconUpload,
//   IconGift,
//   IconWorldWww,
//   IconUser,
// };

// export default function FeatureCard({
//   icon,
//   title,
//   subtitle,
//   onClick,
//   primarycolor,
//   quick_access,
// }: {
//   icon: string;
//   title: string;
//   subtitle: string;
//   onClick: () => void;
//   primarycolor: string;
//   quick_access: boolean;
// }) {
//   const Icon = ICON_MAP[icon] || IconTicket;

//   /* ================= QUICK ACCESS (HORIZONTAL ROW) ================= */
//   if (quick_access) {
//     return (
//       <button
//         onClick={onClick}
//         className="w-full h-[86px] sm:h-[96px] rounded-2xl flex items-center justify-between px-6 transition hover:scale-[1.01] active:scale-[0.99]"
//         style={{
//           background: "rgba(255,255,255,0.04)",
//           border: `1px solid ${primarycolor}55`,
//           boxShadow: "0 12px 40px rgba(0,0,0,0.7)",
//         }}
//       >
//         {/* LEFT ICON */}
//         <Icon className="w-6 h-6 text-[#C9B37E]" stroke={1.2} />

//         {/* CENTER TEXT */}
//         <div className="flex flex-col items-center flex-1">
//           <span className="text-white text-[16px] sm:text-[18px] font-semibold tracking-wide">
//             {title}
//           </span>
//           <span className="text-[#BDBDBD] text-[13px]">{subtitle}</span>
//         </div>

//         {/* RIGHT ICON (DECORATIVE MIRROR) */}
//         <Icon className="w-5 h-5 text-[#C9B37E]" stroke={1.2} />
//       </button>
//     );
//   }

//   /* ================= QUICK SUPPORT (COMPACT TILE) ================= */
//   return (
//     <button
//       onClick={onClick}
//       className="h-[150px] rounded-2xl flex flex-col items-center justify-center gap-3 transition hover:scale-[1.02] active:scale-[0.99]"
//       style={{
//         background: "rgba(255,255,255,0.04)",
//         border: `1px solid ${primarycolor}55`,
//         boxShadow: "0 12px 40px rgba(0,0,0,0.7)",
//       }}
//     >
//       <Icon className="w-7 h-7 text-[#C9B37E]" stroke={1.2} />

//       <span className="text-white font-semibold text-[16px]">{title}</span>

//       <span className="text-[#BDBDBD] text-[13px] text-center px-6">
//         {subtitle}
//       </span>
//     </button>
//   );
// }
