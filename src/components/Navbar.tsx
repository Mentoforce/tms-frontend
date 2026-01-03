"use client";

interface NavbarConfig {
  logoUrl: string;
  lineColor: string;
}

interface NavbarProps {
  config: NavbarConfig;
}

export default function Navbar({ config }: NavbarProps) {
  const { logoUrl, lineColor } = config;

  return (
    <header className="w-full flex flex-col bg-[#0C0A06]">
      <div
        className="
          flex items-center justify-center
          h-18 sm:h-22.5 lg:h-27
          px-6 sm:px-12 lg:px-25
          py-4 sm:py-5 lg:py-6
        "
      >
        <img
          src={logoUrl}
          alt="ELIT Logo"
          width={173}
          height={60}
          className="max-w-35 sm:max-w-40 lg:max-w-43.25 h-auto object-contain"
        />
      </div>

      <div
        aria-hidden
        className="h-px w-full"
        style={{ backgroundColor: lineColor }}
      />
    </header>
  );
}
