// "use client";

// interface NavbarConfig {
//   logoUrl: string;
//   lineColor: string;
// }

// interface NavbarProps {
//   config: NavbarConfig;
// }

// export default function Navbar({ config }: NavbarProps) {
//   const { logoUrl, lineColor } = config;

//   return (
//     <header className="w-full flex flex-col sticky top-0 bg-[#0C0A06] mb-10 z-50">
//       <div
//         className="
//           flex items-center justify-center
//           h-18 sm:h-22.5 lg:h-27
//           px-6 sm:px-12 lg:px-25
//           py-4 sm:py-5 lg:py-6
//         "
//       >
//         <img
//           src={logoUrl}
//           alt="Company Logo"
//           className="max-h-10 sm:max-h-10 lg:max-h-18 w-auto object-contain"
//         />
//       </div>

//       <div
//         aria-hidden
//         className="h-px w-full"
//         style={{ backgroundColor: lineColor }}
//       />
//     </header>
//   );
// }

"use client";

interface NavbarConfig {
  logoUrl: string;
}

interface NavbarProps {
  config: NavbarConfig;
}

export default function Navbar({ config }: NavbarProps) {
  const { logoUrl } = config;

  return (
    <header className="w-full flex flex-col bg-[#0A0A0A]">
      <div
        className="
          flex items-center justify-center
          w-full mx-auto sm:py-[60px] py-[40px]
        "
      >
        <img
          src={logoUrl}
          alt="Company Logo"
          className="
            h-[60px] md:h-[100px]
            w-auto object-contain
          "
        />
      </div>
    </header>
  );
}
