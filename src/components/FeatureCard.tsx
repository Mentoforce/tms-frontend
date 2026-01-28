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
//   const iconSizeClass = quick_access
//     ? "w-[46px] h-[46px] sm:w-[56px] sm:h-[56px]"
//     : "w-[60px] h-[60px] sm:w-[60px] sm:h-[60px]";
//   return (
//     <button
//       onClick={onClick}
//       className={`${
//         quick_access ? "sm:h-73.25" : "sm:h-70"
//       } h-52 cursor-pointer w-full sm:rounded-4xl rounded-2xl flex flex-col items-center justify-center text-center gap-1 transition hover:scale-[1.02] active:scale-[0.99] `}
//       style={{
//         backgroundColor: `${primarycolor}1A`,
//         boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
//       }}
//     >
//       {/* ICON */}
//       <div className="relative flex items-center justify-center w-14.5 h-14.5 mb-2">
//         {quick_access && (
//           <div
//             className="absolute rounded-full sm:w-11.25 w-[31.42px] sm:h-11.25 h-[32.36px]"
//             style={{
//               backgroundColor: primarycolor,
//               opacity: 0.15,
//               top: "20px",
//               left: "23px",
//             }}
//           />
//         )}

//         {/* Icon sits relative and z-10 to stay above the circle */}
//         <div className="relative z-10 text-[#BDBDBD]">
//           <Icon className={iconSizeClass} stroke={0.8} />
//         </div>
//       </div>

//       {/* TITLE */}
//       <h3
//         className={`${
//           quick_access
//             ? "sm:text-[28px] text-[20px]"
//             : "sm:text-[18px] text-[18.01px]"
//         } mt-1 font-semibold text-[#FFFFFF]`}
//       >
//         {title}
//       </h3>

//       {/* SUBTITLE */}
//       <p className="text-[14px] text-[#BDBDBD] px-2 text-center mx-auto leading-relaxed">
//         {subtitle}
//       </p>
//     </button>
//   );
// }

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

  /* ---------------- QUICK ACCESS CARD ---------------- */
  if (quick_access) {
    return (
      <button
        onClick={onClick}
        className="cursor-pointer flex mx-auto w-full md:h-25.5 md:px-10 md:py-7.5 md:rounded-xl items-center justify-between md:border gap-6 border-[0.5px] h-16.25 rounded-lg p-4 hover:opacity-80 transition active:scale-[0.99]"
        style={{
          borderColor: primarycolor,
          backgroundColor: `${primarycolor}1A`,
          color: `${primarycolor}`,
        }}
      >
        <Icon className="w-[19.43px] h-[19.43px] md:w-7 md:h-7" stroke={1.5} />
        <div className="flex flex-col text-center flex-1">
          <span className="text-[12px] md:text-[20px] font-semibold md:font-semibold tracking-wider uppercase">
            {title}
          </span>
          <span className="text-[10px] md:text-[14px] font-light md:font-medium opacity-60">
            {subtitle}
          </span>
        </div>
        <Icon className="w-[19.43px] h-[19.43px] md:w-7 md:h-7" stroke={1.5} />
      </button>
    );
  }

  /* ---------------- QUICK SUPPORT CARD ---------------- */
  return (
    <button
      onClick={onClick}
      className="cursor-pointer w-full md:h-30 h-25 rounded-lg md:rounded-xl md:border border-[0.5px] flex flex-col items-center justify-center gap-3 md:gap-2 transition md:py-5 md:px-20 hover:opacity-80 active:scale-[0.99]"
      style={{
        borderColor: primarycolor,
        backgroundColor: `${primarycolor}1A`,
        color: `${primarycolor}`,
      }}
    >
      <Icon className="md:size-7.5 size-5" stroke={1.5} />
      <div className="flex flex-col items-center">
        <span className="text-[11px] md:text-[16px] font-semibold md:font-bold uppercase md:capitalize">
          {title}
        </span>
        <span
          className="text-[8px] md:text-[11px] font-light md:font-medium text-center px-2 leading-tight opacity-60 truncate w-full block"
          title={subtitle}
        >
          {subtitle}
        </span>
      </div>
    </button>
  );
}
