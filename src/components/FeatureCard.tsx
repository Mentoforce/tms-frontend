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
  return (
    <button
      onClick={onClick}
      className={`${
        quick_access ? "h-75" : "h-70"
      } cursor-pointer w-full rounded-4xl flex flex-col items-center justify-center text-center gap-1 transition hover:scale-[1.02] active:scale-[0.99] `}
      style={{
        backgroundColor: `${primarycolor}1A`,
        boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
      }}
    >
      {/* ICON */}
      <div className="relative flex items-center justify-center w-14.5 h-14.5 mb-2">
        {quick_access && (
          <div
            className="absolute rounded-full"
            style={{
              width: "45px",
              height: "45px",
              backgroundColor: primarycolor,
              opacity: 0.15,
              top: "20px",
              left: "23px",
            }}
          />
        )}

        {/* Icon sits relative and z-10 to stay above the circle */}
        <div className="relative z-10 text-[#BDBDBD]">
          <Icon size={68} stroke={0.8} />
        </div>
      </div>

      {/* TITLE */}
      <h3
        className={`${
          quick_access ? "text-[28px]" : "text-[18px]"
        } mt-3 font-semibold text-[#FFFFFF]`}
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
