// import Navbar from "@/components/Navbar";
import { useOrganisation } from "@/context/OrganisationProvider";
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { organisation } = useOrganisation();
  return (
    <main>
      {/* Public Header */}
      {/* <Navbar/> */}
      {children}
    </main>
  );
}
