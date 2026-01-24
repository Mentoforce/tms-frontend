// "use client";

// import {
//   IconInfoCircle,
//   IconAlertTriangle,
//   IconCheck,
// } from "@tabler/icons-react";
// import { useNotifications } from "@/hooks/useNotifications";
// import { useOrganisation } from "@/context/OrganisationProvider";
// import { X } from "lucide-react";
// import { motion } from "framer-motion";
// import { useEffect } from "react";

// const icons: any = {
//   info: IconInfoCircle,
//   success: IconCheck,
//   warning: IconAlertTriangle,
//   error: IconAlertTriangle,
// };

// export default function NotificationCard() {
//   const { organisation } = useOrganisation();
//   const { current, dismiss, close } = useNotifications();
//   const notification = current;
//   const accent = organisation?.primaryColor || "#DFD1A1";
//   const Icon = icons[notification?.type || "info"];
//   useEffect(() => {
//     if (!notification) return;

//     const timer = setTimeout(close, 5000);
//     return () => clearTimeout(timer);
//   }, [notification, close]);
//   return (
//     notification && (
//       <motion.div
//         key={notification._id || notification.title}
//         initial={{ x: 80, opacity: 0 }}
//         animate={{ x: 0, opacity: 1 }}
//         exit={{ x: -80, opacity: 0 }}
//         transition={{
//           type: "spring",
//           stiffness: 260,
//           damping: 22,
//         }}
//         className="fixed top-16 right-6 max-w-sm rounded-xl p-4 shadow-lg bg-black/90 w-90 text-white z-100"
//         style={{ borderColor: accent, borderWidth: 0.5 }}
//       >
//         <button
//           className="fixed right-10 bg-black cursor-pointer"
//           onClick={close}
//         >
//           <X />
//         </button>
//         <div className="flex gap-3">
//           <Icon />
//           <div>
//             <p className="font-semibold">{notification?.title}</p>
//             <p className="text-sm text-white/70">{notification?.message}</p>
//           </div>
//         </div>

//         <button
//           onClick={dismiss}
//           className="text-xs mt-3 underline text-white/60 cursor-pointer"
//         >
//           Don’t show again
//         </button>
//       </motion.div>
//     )
//   );
// }

"use client";

import {
  IconInfoCircle,
  IconAlertTriangle,
  IconCheck,
} from "@tabler/icons-react";
import { useNotifications } from "@/hooks/useNotifications";
import { useOrganisation } from "@/context/OrganisationProvider";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

const icons: any = {
  info: IconInfoCircle,
  success: IconCheck,
  warning: IconAlertTriangle,
  error: IconAlertTriangle,
};

export default function NotificationCard() {
  const { organisation } = useOrganisation();
  const { current, dismiss, close } = useNotifications();
  const notification = current;
  const accent = organisation?.primaryColor || "#DFD1A1";
  const Icon = icons[notification?.type || "info"];

  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(close, 5000);
    return () => clearTimeout(timer);
  }, [notification, close]);

  return (
    notification && (
      <motion.div
        key={notification._id || notification.title}
        /* ───────── MOBILE + DESKTOP: FROM SIDE ───────── */
        initial={{
          x: 80,
          opacity: 0,
        }}
        animate={{
          x: 0,
          opacity: 1,
        }}
        exit={{
          x: -80,
          opacity: 0,
        }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 22,
        }}
        className="
          fixed z-100
          top-26 sm:top-40
          left-4 right-4 sm:left-auto sm:right-6
          w-auto sm:w-90
          rounded-xl p-4
          bg-black/90 text-white shadow-lg
        "
        style={{ borderColor: accent, borderWidth: 0.5 }}
      >
        <button
          className="absolute top-3 right-3 cursor-pointer text-white/70 hover:text-white"
          onClick={close}
        >
          <X size={18} />
        </button>

        <div className="flex gap-3 pr-6">
          <Icon className="shrink-0" />
          <div>
            <p className="font-semibold leading-tight">{notification?.title}</p>
            <p className="text-sm text-white/70">{notification?.message}</p>
          </div>
        </div>

        <button
          onClick={dismiss}
          className="text-xs mt-3 underline text-white/60 cursor-pointer"
        >
          Don’t show again
        </button>
      </motion.div>
    )
  );
}
