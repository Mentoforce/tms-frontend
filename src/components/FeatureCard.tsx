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
}: {
  icon: string;
  title: string;
  subtitle: string;
  onClick: () => void;
  primarycolor: string;
}) {
  const Icon = ICON_MAP[icon] || IconTicket;
  return (
    <button
      onClick={onClick}
      className="w-full h-70 rounded-2xl flex flex-col items-center justify-center text-center gap-3 transition hover:scale-[1.02] active:scale-[0.99]"
      style={{
        backgroundColor: `${primarycolor}1A`,
        boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
      }}
    >
      {/* ICON */}
      <div className="text-[#BDBDBD]">
        <Icon size={58} stroke={0.8} />
      </div>

      {/* TITLE */}
      <h3 className="text-[18px] mt-3 font-semibold text-[#FFFFFF]">{title}</h3>

      {/* SUBTITLE */}
      <p className="text-[14px] text-[#BDBDBD] px-2 text-center mx-auto leading-relaxed">
        {subtitle}
      </p>
    </button>
  );
}
