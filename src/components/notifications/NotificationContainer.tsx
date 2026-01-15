// "use client";

// import { useNotifications } from "./useNotifications";
// import NotificationCard from "./NotificationCard";

// export default function NotificationContainer({
//   primaryColor,
// }: {
//   primaryColor: string;
// }) {
//   const { current, dismiss } = useNotifications();

//   if (!current) return null;

//   return (
//     <NotificationCard
//       notification={current}
//       onClose={dismiss}
//       accent={primaryColor}
//     />
//   );
// }
"use client";

import { useNotifications } from "./useNotifications";
import NotificationCard from "./NotificationCard";
import { useOrganisation } from "@/context/OrganisationProvider";

export default function NotificationContainer() {
  const { organisation } = useOrganisation();
  const { current, dismiss } = useNotifications();

  if (!current) return null;

  return (
    <div className="fixed top-6 right-6 z-[9999]">
      <NotificationCard
        notification={current}
        accent={organisation?.primaryColor || "#DFD1A1"}
        onClose={dismiss}
      />
    </div>
  );
}
