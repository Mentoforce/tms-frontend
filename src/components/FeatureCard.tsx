// components/FeatureCard.tsx
// export default function FeatureCard({
//   icon,
//   title,
//   subtitle,
//   onClick,
//   primarycolor,
// }: {
//   icon: string;
//   title: string;
//   subtitle: string;
//   onClick: () => void;
//   primarycolor: string;
// }) {
//   return (
//     <button
//       onClick={onClick}
//       className="bg-black cursor-pointer rounded-lg shadow p-6 text-left hover:shadow-md transition w-full"
//     >
//       <div className="text-3xl mb-3">{icon}</div>
//       <h3 className="font-semibold text-lg">{title}</h3>
//       <p className="text-sm text-gray-600">{subtitle}</p>
//     </button>
//   );
// }

import { IconProps } from "@tabler/icons-react";
export default function FeatureCard({
  icon,
  title,
  subtitle,
  onClick,
  primarycolor,
}: {
  icon: React.FC<IconProps>;
  title: string;
  subtitle: string;
  onClick: () => void;
  primarycolor: string;
}) {
  const Icon = icon;
  return (
    <button
      onClick={onClick}
      className="
        w-full
        h-70
        rounded-2xl
        flex
        flex-col
        items-center
        justify-center
        text-center
        gap-3
        transition
        hover:scale-[1.02]
        active:scale-[0.99]
      "
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
      <p
        className="
    text-[14px]
    text-[#BDBDBD]
    px-2
    text-center
    mx-auto
    leading-relaxed
  "
      >
        {subtitle}
      </p>
    </button>
  );
}
