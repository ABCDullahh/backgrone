"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/Footer";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isEditor = pathname === "/editor";

  return (
    <>
      {children}
      {!isEditor && <Footer />}
    </>
  );
}
