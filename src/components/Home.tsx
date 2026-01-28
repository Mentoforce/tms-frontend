// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import FeatureCard from "@/components/FeatureCard";
// import RaiseTicketModal from "@/components/RaiseTicketModal";
// import { handleFeatureAction } from "@/lib/featureHandler";
// import Navbar from "./Navbar";
// import { useOrganisation } from "@/context/OrganisationProvider";
// import RequestCallbackModal from "./CallbackRequestModal";
// import SearchTicket from "./SearchTicket";
// import BonusClaimModal from "./BonusClaimModal";
// import UploadFileModal from "./UploadFileModal";
// import Footer from "./Footer";
// import api from "@/lib/axios";
// import NotificationCard from "./NotificationCard";

// export default function Home() {
//   const router = useRouter();
//   const { organisation } = useOrganisation();
//   const { logo, primaryColor } = organisation!;
//   const [features, setFeatures] = useState<any>([]);
//   const [openModals, setOpenModals] = useState<Record<string, boolean>>({
//     RAISE_TICKET: false,
//     REQUEST_CALLBACK: false,
//     BONUS_CLAIM: false,
//     UPLOAD_FILE: false,
//   });
//   const getFeatures = async () => {
//     const res = await api.get("/buttons");
//     setFeatures(res.data.data);
//   };

//   const openModal = (key: string) =>
//     setOpenModals((prev) => ({ ...prev, [key]: true }));

//   const closeModal = (key: string) =>
//     setOpenModals((prev) => ({ ...prev, [key]: false }));

//   useEffect(() => {
//     getFeatures();
//   }, []);
//   return (
//     <>
//       <NotificationCard />
//       <Navbar
//         config={{
//           logoUrl: logo,
//           lineColor: primaryColor,
//         }}
//       />

//       <RaiseTicketModal
//         open={openModals.RAISE_TICKET}
//         onClose={() => closeModal("RAISE_TICKET")}
//         primarycolor={primaryColor}
//       />
//       <RequestCallbackModal
//         open={openModals.REQUEST_CALLBACK}
//         onClose={() => closeModal("REQUEST_CALLBACK")}
//         primarycolor={primaryColor}
//       />
//       <BonusClaimModal
//         open={openModals.BONUS_CLAIM}
//         onClose={() => closeModal("BONUS_CLAIM")}
//         primarycolor={primaryColor}
//       />
//       <UploadFileModal
//         open={openModals.UPLOAD_FILE}
//         onClose={() => closeModal("UPLOAD_FILE")}
//         primarycolor={primaryColor}
//       />

//       {/* Feature Cards */}
//       <section className="w-full max-w-360 mx-auto px-4 md:px-6 mb-16">
//         <h2 className="mb-6 sm:text-[35px] text-[20px] font-semibold tracking-tight text-[#BDBDBD] uppercase">
//           QUICK ACCESS
//         </h2>

//         {/* FEATURE CARDS GRID*/}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full gap-5">
//           {features.map(
//             (feature: any) =>
//               feature.quick_access && (
//                 <FeatureCard
//                   key={feature._id}
//                   icon={feature.icon}
//                   title={feature.title.toUpperCase()}
//                   subtitle={feature.subtitle}
//                   onClick={() =>
//                     handleFeatureAction(feature, openModal, router)
//                   }
//                   primarycolor={primaryColor}
//                   quick_access={feature.quick_access}
//                 />
//               ),
//           )}
//         </div>

//         <h2 className="my-6 mt-16 sm:text-[35px] text-[20px] font-semibold tracking-tight text-[#BDBDBD] uppercase">
//           QUICK SUPPORT
//         </h2>

//         {/* FEATURE CARDS GRID*/}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 w-full gap-5 ">
//           {features.map(
//             (feature: any) =>
//               !feature.quick_access && (
//                 <FeatureCard
//                   key={feature._id}
//                   icon={feature.icon}
//                   title={feature.title}
//                   subtitle={feature.subtitle}
//                   onClick={() =>
//                     handleFeatureAction(feature, openModal, router)
//                   }
//                   primarycolor={primaryColor}
//                   quick_access={feature.quick_access}
//                 />
//               ),
//           )}
//         </div>
//       </section>

//       <SearchTicket primarycolor={primaryColor} />
//       <Footer primarycolor={primaryColor} />
//     </>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FeatureCard from "@/components/FeatureCard";
import RaiseTicketModal from "@/components/RaiseTicketModal";
import { handleFeatureAction } from "@/lib/featureHandler";
import Navbar from "./Navbar";
import { useOrganisation } from "@/context/OrganisationProvider";
import RequestCallbackModal from "./CallbackRequestModal";
import SearchTicket from "./SearchTicket";
import BonusClaimModal from "./BonusClaimModal";
import UploadFileModal from "./UploadFileModal";
import Footer from "./Footer";
import api from "@/lib/axios";
import NotificationCard from "./NotificationCard";

export default function Home() {
  const router = useRouter();
  const { organisation } = useOrganisation();
  const { logo, primaryColor } = organisation!;
  const [features, setFeatures] = useState<any>([]);
  const [openModals, setOpenModals] = useState<Record<string, boolean>>({
    RAISE_TICKET: false,
    REQUEST_CALLBACK: false,
    BONUS_CLAIM: false,
    UPLOAD_FILE: false,
  });

  const getFeatures = async () => {
    const res = await api.get("/buttons");
    setFeatures(res.data.data);
  };

  const openModal = (key: string) =>
    setOpenModals((prev) => ({ ...prev, [key]: true }));

  const closeModal = (key: string) =>
    setOpenModals((prev) => ({ ...prev, [key]: false }));

  useEffect(() => {
    getFeatures();
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <NotificationCard />
      <Navbar config={{ logoUrl: logo }} />

      <RaiseTicketModal
        open={openModals.RAISE_TICKET}
        onClose={() => closeModal("RAISE_TICKET")}
        primarycolor={primaryColor}
      />
      <RequestCallbackModal
        open={openModals.REQUEST_CALLBACK}
        onClose={() => closeModal("REQUEST_CALLBACK")}
        primarycolor={primaryColor}
      />
      <BonusClaimModal
        open={openModals.BONUS_CLAIM}
        onClose={() => closeModal("BONUS_CLAIM")}
        primarycolor={primaryColor}
      />
      <UploadFileModal
        open={openModals.UPLOAD_FILE}
        onClose={() => closeModal("UPLOAD_FILE")}
        primarycolor={primaryColor}
      />

      {/* ---------------- MAIN CONTAINER---------------- */}
      <section
        className="w-full min-w-82 max-w-90 md:max-w-210 mx-auto pt-0 pb-12 flex flex-col gap-12 md:gap-20"
        style={{ color: `${primaryColor}` }}
      >
        {/* QUICK ACCESS SECTION */}
        <div>
          <div className="flex flex-col gap-1 mb-6 md:mb-8">
            <h2 className="text-[20px] md:text-[30px] font-semibold uppercase tracking-tight mb-4">
              Quick Access
            </h2>
            <div
              className="w-full h-px md:h-[0.5px] opacity-20"
              style={{ backgroundColor: `${primaryColor}` }}
            />
          </div>
          <div className="flex flex-col gap-3 md:gap-5">
            {features.map(
              (feature: any) =>
                feature.quick_access && (
                  <FeatureCard
                    key={feature._id}
                    icon={feature.icon}
                    title={feature.title}
                    subtitle={feature.subtitle}
                    onClick={() =>
                      handleFeatureAction(feature, openModal, router)
                    }
                    primarycolor={primaryColor}
                    quick_access={feature.quick_access}
                  />
                ),
            )}
          </div>
        </div>

        {/* QUICK SUPPORT SECTION */}
        <div>
          <div className="flex flex-col gap-1 mb-6 md:mb-8">
            <h2 className="text-[20px] md:text-[30px] font-semibold uppercase tracking-tight mb-4">
              Quick Support
            </h2>
            <div
              className="w-full h-px md:h-[0.5px] opacity-20"
              style={{ backgroundColor: `${primaryColor}` }}
            />
          </div>
          <div className="grid grid-cols-2 gap-3 md:gap-x-5.5 md:gap-y-5">
            {features.map(
              (feature: any) =>
                !feature.quick_access && (
                  <FeatureCard
                    key={feature._id}
                    icon={feature.icon}
                    title={feature.title}
                    subtitle={feature.subtitle}
                    onClick={() =>
                      handleFeatureAction(feature, openModal, router)
                    }
                    primarycolor={primaryColor}
                    quick_access={feature.quick_access} // doubt: {false}
                  />
                ),
            )}
          </div>
        </div>
      </section>

      <SearchTicket primarycolor={primaryColor} />
      <Footer primarycolor={primaryColor} />
    </div>
  );
}
