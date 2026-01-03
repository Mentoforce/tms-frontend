// import Navbar from "@/components/Navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      {/* Public Header */}
      {/* <Navbar/> */}
      {children}
    </main>
  );
}
