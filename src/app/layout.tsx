import type { Metadata } from "next";
import "./globals.css";
import { OrganisationProvider } from "@/context/OrganisationProvider";
import { Montserrat } from "next/font/google";
import RegisterSW from "@/components/RegisterSW";
import InstallBanner from "@/components/InstallBanner";

export const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TMS",
  description: "Elit",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={montserrat.className}>
        <RegisterSW />
        <OrganisationProvider>
          {children}
          <InstallBanner />
        </OrganisationProvider>
      </body>
    </html>
  );
}
