"use client";

import { useEffect, useState } from "react";
import { useOrganisation } from "@/context/OrganisationProvider";
import { fetchQuickAccess } from "@/lib/quickAccessHandler";
import { QuickAccessConfig } from "@/types/quickAccess";
import FeatureCard from "./ui/featuredcard";
import { useRouter } from "next/navigation";
import { iconMapper } from "@/lib/iconMapper";

export default function QuickAccess() {
  const { organisation } = useOrganisation();
  const [cards, setCards] = useState<QuickAccessConfig[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!organisation) return;

    fetchQuickAccess(organisation.code).then(setCards).catch(console.error);
  }, [organisation]);

  if (!organisation || cards.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold mb-6">Quick Access</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards
          .filter((c) => c.enabled)
          .map((card) => (
            <FeatureCard
              key={card.id}
              title={card.title}
              subtitle={card.subtitle}
              icon={card.icon}
              bgColor={organisation.primaryColor}
              onClick={() => {
                if (card.action.type === "redirect") {
                  router.push(card.action.target);
                } else {
                  // modal handler (existing logic)
                  window.dispatchEvent(
                    new CustomEvent("open-modal", {
                      detail: card.action.target,
                    })
                  );
                }
              }}
            />
          ))}
      </div>
    </section>
  );
}

// import FeatureCard from "@/components/ui/featuredcard";
// import { quickAccessIcons } from "@/lib/iconMapper";
// import { QuickAccessConfig } from "@/types/quickAccess";

// interface Props {
//   config: QuickAccessConfig;
// }

// export default function QuickAccess({ config }: Props) {
//   return (
//     <section
//       style={{
//         paddingLeft: "100px",
//         paddingRight: "100px",
//         paddingTop: "80px",
//       }}
//     >
//       <h2 className="mb-8 text-lg font-semibold tracking-widest text-white">
//         QUICK ACCESS
//       </h2>

//       <div
//         className="grid gap-8"
//         style={{
//           gridTemplateColumns: `repeat(${Math.min(
//             config.cards.length,
//             3
//           )}, minmax(0, 1fr))`,
//         }}
//       >
//         {config.cards.map((card) => (
//           <FeatureCard
//             key={card.id}
//             icon={quickAccessIcons[card.icon]}
//             title={card.title}
//             description={card.description}
//             href={card.redirectUrl}
//             bgColor={config.cardBgColor}
//           />
//         ))}
//       </div>
//     </section>
//   );
// }

//-----------------------------------------------------------------------

//working one down
// import FeatureCard from "@/components/ui/featuredcard";
// import { Globe, Gift, User } from "lucide-react";

// const cardTheme = {
//   backgroundColor: "#1A160C", // this will come from API later
// };

// export default function QuickAccess() {
//   return (
//     <section
//       style={{
//         paddingLeft: "100px",
//         paddingRight: "100px",
//         paddingTop: "80px",
//         backgroundColor: "#0C0A06",
//       }}
//     >
//       <h2 className="mb-8 text-lg font-semibold tracking-widest text-white">
//         QUICK ACCESS
//       </h2>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//         <FeatureCard
//           icon={<Globe size={28} />}
//           title="VISIT WEBSITE"
//           description="Go to the Current Address of the Website"
//           bgColor={cardTheme.backgroundColor}
//         />

//         <FeatureCard
//           icon={<Gift size={28} />}
//           title="BONUS CLAIM PAGE"
//           description="Claim your Daily Loss Bonus"
//           bgColor={cardTheme.backgroundColor}
//         />

//         <FeatureCard
//           icon={<User size={28} />}
//           title="ACCOUNT VERIFICATION"
//           description="Verify User Account"
//           bgColor={cardTheme.backgroundColor}
//         />
//       </div>
//     </section>
//   );
// }
